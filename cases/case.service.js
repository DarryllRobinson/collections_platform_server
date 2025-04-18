const tenantdb = require("../helpers/tenant.db");
const tenantConfig = require("../helpers/tenant.config");
const db = require("../helpers/db");
const { QueryTypes } = require("sequelize");

module.exports = {
  // getAll,
  getById,
  getAllByAccountNumber,
  bulkCreate,
  create,
  update,
  delete: _delete,
};

// async function connectDB(user, password, db) {
//   const sequelize = await tenantdb.connect(user, password);
//   return require(`../${db}s/${db}.model`)(sequelize);
// }

// async function getAll(user, password) {
//   const db = await connectDB(user, password, 'case');
//   const cases = await db.findAll();
//   return cases.map((x) => basicDetails(x));
// }

// async function getById(id, user, password) {
//   const caseObject = await getCase(id, user, password);
//   return basicDetails(caseObject);
// }

async function getById(id) {
  const caseObject = await db.Case.findByPk(id);
  if (!caseObject) throw "Case not found";
  return basicDetails(caseObject);
}

async function getAllByAccountNumber(accountNumber) {
  try {
    const sequelize = await tenantdb.connect(
      tenantConfig.devConfig.user,
      tenantConfig.devConfig.password
    );
    const cases = await sequelize.query(
      `SELECT *
      FROM tbl_cases
      WHERE f_accountNumber = ${accountNumber};`,
      { type: QueryTypes.SELECT }
    );
    return cases;
  } catch (error) {
    console.error("Error with accounts account.service: ", error);
    throw error;
  }
}

async function bulkCreate(params, user, password) {
  // Count existing rows to be able to count number of affected rows
  const db = await connectDB(user, password, "case");
  const existingRows = await db.count({ distinct: "caseNumber" });

  await db.bulkCreate(params);
  const totalRows = await db.count({ distinct: "caseNumber" });

  return totalRows - existingRows;
}

async function create(params, user, password) {
  const db = await connectDB(user, password, "case");
  const caseObject = new db(params, user, password);

  // save case
  await caseObject.save();

  return basicDetails(caseObject);
}

async function update(id, params, user, password) {
  const caseObject = await getCase(id, user, password);

  // copy params to case and save
  //console.log('******************************** update params: ', params, user);
  Object.assign(caseObject, params);
  caseObject.updated = Date.now();
  caseObject.tenant = user;
  await caseObject.save();

  return basicDetails(caseObject);
}

async function _delete(id, user, password) {
  const caseObject = await getCase(id, user, password);
  await caseObject.destroy();
}

// helper functions

async function getCase(id, user, password) {
  const db = await connectDB(user, password, "case");
  const caseObject = await db.findByPk(id);
  if (!caseObject) throw "Case not found";
  return caseObject;
}

function basicDetails(caseObject) {
  const {
    id,
    caseNumber,
    currentAssignment,
    initialAssignment,
    caseNotes,
    kamNotes,
    currentStatus,
    nextVisitDateTime,
    pendReason,
    resolution,
    caseReason,
    lockedDatetime,
    createdAt,
    createdBy,
    reassignedDate,
    reassignedBy,
    reopenedDate,
    reopenedBy,
    updatedAt,
    updatedBy,
    accountNumber,
  } = caseObject;
  return {
    id,
    caseNumber,
    currentAssignment,
    initialAssignment,
    caseNotes,
    kamNotes,
    currentStatus,
    nextVisitDateTime,
    pendReason,
    resolution,
    caseReason,
    lockedDatetime,
    createdAt,
    createdBy,
    reassignedDate,
    reassignedBy,
    reopenedDate,
    reopenedBy,
    updatedAt,
    updatedBy,
    accountNumber,
  };
}
