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
  const db = await connectDB(user, password, 'contact');
  const contacts = await db.findAll();
  return contacts.map((x) => basicDetails(x));
}

async function getById(id, user, password) {
  const db = await connectDB(user, password, 'contact');
  const contact = await db.findAll({ where: { f_accountNumber: id } });
  //console.log('********************** contact: ' + JSON.stringify(contact));
  return contact;
}

async function bulkCreate(params, user, password) {
  const db = await connectDB(user, password, 'contact');
  // Count existing rows to be able to count number of affected rows
  const existingRows = await db.count({ distinct: 'id' });

  await db.bulkCreate(params);
  const totalRows = await db.count({ distinct: 'id' });

  return totalRows - existingRows;
}

async function create(params, user, password) {
  const db = await connectDB(user, password, 'contact');
  // validate
  /*if (await db.Contact.findOne({ where: { name: params.name } })) {
    throw 'Contact "' + params.name + '" is already registered';
  }*/

  const contact = new db(params);

  // save contact
  await contact.save();

  return basicDetails(contact);
}

async function update(id, params, user, password) {
  const contact = await getContact(id, user, password);

  // copy params to contact and save
  Object.assign(contact, params);
  contact.updated = Date.now();
  await contact.save();

  return basicDetails(contact);
}

async function _delete(id, user, password) {
  const contact = await getContact(id, user, password);
  await contact.destroy();
}

// helper functions

async function getContact(id, user, password) {
  const db = await connectDB(user, password, 'contact');
  const contact = await db.findOne({ where: { f_accountNumber: id } });
  if (!contact) throw 'Contact not found';
  //console.log('******************************** contact: ', contact);
  return contact;
}

function basicDetails(contact) {
  const {
    id,
    primaryContactName,
    primaryContactNumber,
    primaryContactEmail,
    representativeName,
    representativeNumber,
    representativeEmail,
    alternativeRepName,
    alternativeRepNumber,
    alternativeRepEmail,
    otherNumber1,
    otherNumber2,
    otherNumber3,
    otherNumber4,
    otherNumber5,
    otherNumber6,
    otherNumber7,
    otherNumber8,
    otherNumber9,
    otherNumber10,
    otherEmail1,
    otherEmail2,
    otherEmail3,
    otherEmail4,
    otherEmail5,
    otherEmail6,
    otherEmail7,
    otherEmail8,
    otherEmail9,
    otherEmail10,
    dnc1,
    dnc2,
    dnc3,
    dnc4,
    dnc5,
    createdAt,
    createdBy,
    updatedAt,
    updatedBy,
    accountNumber,
  } = contact;
  return {
    id,
    primaryContactName,
    primaryContactNumber,
    primaryContactEmail,
    representativeName,
    representativeNumber,
    representativeEmail,
    alternativeRepName,
    alternativeRepNumber,
    alternativeRepEmail,
    otherNumber1,
    otherNumber2,
    otherNumber3,
    otherNumber4,
    otherNumber5,
    otherNumber6,
    otherNumber7,
    otherNumber8,
    otherNumber9,
    otherNumber10,
    otherEmail1,
    otherEmail2,
    otherEmail3,
    otherEmail4,
    otherEmail5,
    otherEmail6,
    otherEmail7,
    otherEmail8,
    otherEmail9,
    otherEmail10,
    dnc1,
    dnc2,
    dnc3,
    dnc4,
    dnc5,
    createdAt,
    createdBy,
    updatedAt,
    updatedBy,
    accountNumber,
  };
}
