const tenantdb = require('../helpers/tenant.db');
//const db = require('../helpers/db');

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
  const db = await connectDB(user, password, 'outcome');
  const outcomes = await db.findAll();
  return outcomes.map((x) => basicDetails(x));
}

async function getById(id, user, password) {
  const db = await connectDB(user, password, 'outcome');
  const outcomes = await db.findAll({
    where: { f_caseNumber: id },
  });
  return outcomes;
}

async function bulkCreate(params, user, password) {
  const db = await connectDB(user, password, 'outcome');
  // Count existing rows to be able to count number of affected rows
  const existingRows = await db.count({ distinct: 'id' });

  await db.bulkCreate(params);
  const totalRows = await db.count({ distinct: 'id' });

  return totalRows - existingRows;
}

async function create(params, user, password) {
  //console.log('******************** outcome: ', params, user);
  const db = await connectDB(user, password, 'outcome');
  // validate
  /*if (await db.Outcome.findOne({ where: { name: params.name } })) {
    throw 'Outcome "' + params.name + '" is already registered';
  }*/

  const outcome = new db(params);
  outcome.tenant = user;
  //console.log('************************************ outcome: ', outcome);

  // save outcome
  await outcome.save();

  return basicDetails(outcome);
}

async function update(id, params, user, password) {
  const outcome = await getOutcome(id, user, password);

  // validate (if email was changed)
  /*if (
    params.name &&
    outcome.name !== params.name &&
    (await db.Outcome.findOne({ where: { name: params.name } }))
  ) {
    throw 'Outcome "' + params.name + '" is already taken';
  }*/

  // copy params to outcome and save
  Object.assign(outcome, params);
  outcome.updated = Date.now();
  outcome.tenant = user;
  await outcome.save();

  return basicDetails(outcome);
}

async function _delete(id, user, password) {
  const outcome = await getOutcome(id, user, password);
  await outcome.destroy();
}

// helper functions

async function getOutcome(id, user, password) {
  const db = await connectDB(user, password, 'outcome');
  const outcome = await db.findByPk(id);
  if (!outcome) throw 'Outcome not found';
  return outcome;
}

function basicDetails(outcome) {
  const {
    id,
    outcomeStatus,
    transactionType,
    numberCalled,
    emailUsed,
    contactPerson,
    outcomeResolution,
    ptpDate,
    ptpAmount,
    debitResubmissionDate,
    debitResubmissionAmount,
    outcomeNotes,
    nextSteps,
    createdAt,
    createdBy,
    caseId,
  } = outcome;
  return {
    status: 'Ok',
    id,
    outcomeStatus,
    transactionType,
    numberCalled,
    emailUsed,
    contactPerson,
    outcomeResolution,
    ptpDate,
    ptpAmount,
    debitResubmissionDate,
    debitResubmissionAmount,
    outcomeNotes,
    nextSteps,
    createdAt,
    createdBy,
    caseId,
  };
}
