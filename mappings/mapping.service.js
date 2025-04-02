const tenantdb = require('../helpers/tenant.db');

module.exports = {
  getAll,
  getById,
  bulkCreate,
  create,
  update,
  delete: _delete,
};

async function connectDB(user, password, db) {
  const sequelize = await tenantdb.connect(user, password);
  return require(`../${db}s/${db}.model`)(sequelize);
}

async function getAll(user, password) {
  const db = await connectDB(user, password, 'mapping');
  const mappings = await db.findAll();
  return mappings.map((x) => basicDetails(x));
}

async function getById(id, user, password) {
  const db = await connectDB(user, password, 'mapping');
  const mapping = await db.findAll({ where: { f_accountNumber: id } });
  //console.log('********************** mapping: ' + JSON.stringify(mapping));
  return mapping;
}

async function bulkCreate(params, user, password) {
  const db = await connectDB(user, password, 'mapping');
  // Count existing rows to be able to count number of affected rows
  const existingRows = await db.count({ distinct: 'id' });

  await db.bulkCreate(params);
  const totalRows = await db.count({ distinct: 'id' });

  return totalRows - existingRows;
}

async function create(params, user, password) {
  const db = await connectDB(user, password, 'mapping');
  // validate
  /*if (await db.Mapping.findOne({ where: { name: params.name } })) {
    throw 'Mapping "' + params.name + '" is already registered';
  }*/

  const mapping = new db(params);

  // save mapping
  await mapping.save();

  return basicDetails(mapping);
}

async function update(id, params, user, password) {
  const mapping = await getMapping(id, user, password);

  // copy params to mapping and save
  Object.assign(mapping, params);
  mapping.updated = Date.now();
  await mapping.save();

  return basicDetails(mapping);
}

async function _delete(id, user, password) {
  const mapping = await getMapping(id, user, password);
  await mapping.destroy();
}

// helper functions

async function getMapping(id, user, password) {
  const db = await connectDB(user, password, 'mapping');
  const mapping = await db.findOne({ where: { f_accountNumber: id } });
  if (!mapping) throw 'Mapping not found';
  //console.log('******************************** mapping: ', mapping);
  return mapping;
}

function basicDetails(mapping) {
  const { id, table, db_field, web_field } = mapping;
  return {
    id,
    table,
    db_field,
    web_field,
  };
}
