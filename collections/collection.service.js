const tenantdb = require('../helpers/tenant.db');
const { QueryTypes } = require('sequelize');

module.exports = {
  getAll,
  getCollection,
};

async function connectDB(user, password, db) {
  const sequelize = await tenantdb.connect(user, password);
  return require(`../${db}s/${db}.model`)(sequelize);
}

async function connectNDB(user, password, dbs) {
  //console.log('connectNDB: ', dbs);
  const sequelize = await tenantdb.connect(user, password);
  let dbModels = {};
  dbs.forEach((db) => {
    //console.log('******!!!!!!!! here: ', db);
    let tempdb = require(`../${db}s/${db}.model`)(sequelize);
    Object.assign(dbModels, tempdb);
    //console.log('******!!!!!!!! here now: ', dbModels);
  });
  //console.log('******!!!!!!!! here now: ', dbModels);
  return dbModels;
}

async function getAll(user, password) {
  const sequelize = await tenantdb.connect(user, password);
  const collections = await sequelize.query(
    `SELECT customerRefNo, customerName, regIdNumber, amountDue,
    accountNumber, creditLimit, currentBalance, debtorAge, totalBalance,
    caseNotes, caseNumber, currentAssignment, currentStatus, nextVisitDateTime,
    resolution, cases.updatedAt, cases.updatedBy
    FROM customers, accounts, cases
    WHERE customerRefNo = f_customerRefNo
    AND accountNumber = f_accountNumber`,
    { type: QueryTypes.SELECT }
  );
  return collections;
}

async function getCollection(id, user, password) {
  const sequelize = await tenantdb.connect(user, password);
  const collection = await sequelize.query(
    `SELECT caseNotes, caseNumber, currentAssignment, currentStatus, kamNotes,
    nextVisitDateTime, resolution, cases.updatedBy,
    amountDue, accountNotes, accountNumber, accountStatus, creditLimit, currentBalance,
    days30, days60, days90, days120, days150, days180, days180Over,
    debtorAge, debitOrderDate, lastPaymentAmount, lastPaymentAmount,
    lastPTPAmount, lastPTPDate, paymentDueDate, totalBalance
    representativeName, representativeNumber,
    customerEntity, customerName, regIdNumber, regIdStatus
    FROM customers
    LEFT JOIN accounts
    ON customerRefNo = f_customerRefNo
    LEFT JOIN cases
    ON accountNumber = f_accountNumber
    LEFT JOIN contacts
    ON contacts.f_accountNumber = accounts.accountNumber
    AND cases.caseNumber = ${id}`,
    { type: QueryTypes.SELECT }
  );
  return collectionFields(collection);
}

async function dddgetCollection(id, user, password) {
  const sequelize = await tenantdb.connect(user, password);
  const collection = await sequelize.query(
    `SELECT caseNotes, caseNumber, currentAssignment, currentStatus, kamNotes,
    nextVisitDateTime, resolution, cases.updatedBy,
    amountDue, accountNotes, accountNumber, accountStatus, creditLimit, currentBalance,
    days30, days60, days90, days120, days150, days180, days180Over,
    debtorAge, debitOrderDate, lastPaymentAmount, lastPaymentAmount,
    lastPTPAmount, lastPTPDate, paymentDueDate, totalBalance
    representativeName, representativeNumber,
    customerEntity, customerName, regIdNumber, regIdStatus
    FROM cases, accounts, contacts, customers
    WHERE cases.f_accountNumber = accounts.accountNumber
    AND contacts.f_accountNumber = accounts.accountNumber
    AND accounts.f_customerRefNo = customers.customerRefNo
    AND cases.caseNumber = ${id}`,
    { type: QueryTypes.SELECT }
  );

  /*console.log(
    '****************************************************************collection: ' +
      JSON.stringify(collection)
  );*/
  return collectionFields(collection);
  //return collection;
}

async function getAllStatus(recordStatus) {
  const collections = await db.Case.findAll({
    attributes: [
      'caseNumber',
      'caseNotes',
      'currentAssignment',
      'currentStatus',
      'kamNotes',
      'nextVisitDateTime',
      'resolution',
      'updatedAt',
      'updatedBy',
    ],
    include: [
      {
        model: db.Outcome,
        attributes: ['outcomeNotes'],
      },
    ],
    where: { currentStatus: recordStatus },
  });
  return collections.map((x) => queueFields(x));
}

function queueFields(collection) {
  //console.log('collection: ' + JSON.stringify(collection));
  const {
    customerName,
    customerEntity,
    regIdNumber,
    regIdStatus,
    accounts: [
      {
        amountDue,
        accountNotes,
        accountNumber,
        accountStatus,
        creditLimit,
        currentBalance,
        days30,
        days60,
        days90,
        days120,
        days150,
        days180,
        days180Over,
        debtorAge,
        debitOrderDate,
        lastPaymentAmount,
        lastPaymentDate,
        lastPTPAmount,
        lastPTPDate,
        paymentDueDate,
        totalBalance,
        contact: { representativeName, representativeNumber },
        cases: [
          {
            caseNotes,
            caseNumber,
            currentAssignment,
            currentStatus,
            kamNotes,
            nextVisitDateTime,
            resolution,
            updatedBy,
          },
        ],
      },
    ],
  } = collection;

  return {
    customerName,
    customerEntity,
    regIdNumber,
    regIdStatus,
    amountDue,
    accountNotes,
    accountNumber,
    accountStatus,
    creditLimit,
    currentBalance,
    days30,
    days60,
    days90,
    days120,
    days150,
    days180,
    days180Over,
    debtorAge,
    debitOrderDate,
    lastPaymentAmount,
    lastPaymentDate,
    lastPTPAmount,
    lastPTPDate,
    paymentDueDate,
    totalBalance,
    representativeName,
    representativeNumber,
    caseNotes,
    caseNumber,
    currentAssignment,
    currentStatus,
    kamNotes,
    nextVisitDateTime,
    resolution,
    updatedBy,
  };
}

function collectionsFields(collection) {
  //console.log('collection: ' + JSON.stringify(collection));
  //console.log('collection: ', collection);

  const {
    customerRefNo,
    customerName,
    regIdNumber,
    amountDue,
    accountNumber,
    creditLimit,
    currentBalance,
    debtorAge,
    totalBalance,
    caseNotes,
    caseNumber,
    currentAssignment,
    currentStatus,
    nextVisitDateTime,
    resolution,
    updatedAt,
    updatedBy,
  } = collection;

  return {
    customerRefNo,
    customerName,
    regIdNumber,
    amountDue,
    accountNumber,
    creditLimit,
    currentBalance,
    debtorAge,
    totalBalance,
    caseNotes,
    caseNumber,
    currentAssignment,
    currentStatus,
    nextVisitDateTime,
    resolution,
    updatedAt,
    updatedBy,
  };

  /*const {
    customerRefNo,
    customerName,
    regIdNumber,
    accounts: [
      {
        amountDue,
        accountNumber,
        creditLimit,
        currentBalance,
        debtorAge,
        totalBalance,
        cases: [
          {
            caseNotes,
            caseNumber,
            currentAssignment,
            currentStatus,
            nextVisitDateTime,
            resolution,
            updatedAt,
            updatedBy,
          },
        ],
      },
    ],
  } = collection;

  return {
    customerRefNo,
    customerName,
    regIdNumber,
    amountDue,
    accountNumber,
    creditLimit,
    currentBalance,
    debtorAge,
    totalBalance,
    caseNotes,
    caseNumber,
    currentAssignment,
    currentStatus,
    nextVisitDateTime,
    resolution,
    updatedAt,
    updatedBy,
  };*/
}

function collectionFields(collection) {
  console.log('************** collection: ' + JSON.stringify(collection));
  const [
    {
      caseNotes,
      caseNumber,
      currentAssignment,
      currentStatus,
      kamNotes,
      nextVisitDateTime,
      resolution,
      updatedBy,
      amountDue,
      accountNotes,
      accountNumber,
      accountStatus,
      creditLimit,
      currentBalance,
      days30,
      days60,
      days90,
      days120,
      days150,
      days180,
      days180Over,
      debtorAge,
      debitOrderDate,
      lastPaymentAmount,
      lastPaymentDate,
      lastPTPAmount,
      lastPTPDate,
      paymentDueDate,
      totalBalance,
      representativeName,
      representativeNumber,
      customerEntity,
      customerName,
      regIdNumber,
    },
  ] = collection;

  return {
    customerEntity,
    customerName,
    regIdNumber,
    representativeName,
    representativeNumber,
    amountDue,
    accountNotes,
    accountNumber,
    accountStatus,
    creditLimit,
    currentBalance,
    days30,
    days60,
    days90,
    days120,
    days150,
    days180,
    days180Over,
    debtorAge,
    debitOrderDate,
    lastPaymentAmount,
    lastPaymentDate,
    lastPTPAmount,
    lastPTPDate,
    paymentDueDate,
    totalBalance,
    caseNotes,
    caseNumber,
    currentAssignment,
    currentStatus,
    nextVisitDateTime,
    kamNotes,
    resolution,
    updatedBy,
  };
}
