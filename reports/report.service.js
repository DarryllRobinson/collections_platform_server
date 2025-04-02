const tenantdb = require('../helpers/tenant.db');
const { Op } = require('sequelize');
const sequelize = require('sequelize');
const { QueryTypes } = require('sequelize');

module.exports = {
  getAging,
  getAgentPTP,
  getDatePTP,
  getAgentActivity,
};

async function connectDB(user, password, db) {
  const sequelize = await tenantdb.connect(user, password);
  return require(`../${db}s/${db}.model`)(sequelize);
}

async function getAging(user, password) {
  console.log('getAging service', user, password);
  const db = await connectDB(user, password, 'account');
  const reports = await db.findAll({
    attributes: [
      [sequelize.fn('SUM', sequelize.col('currentBalance')), 'Current'],
      [sequelize.fn('SUM', sequelize.col('days30')), '30'],
      [sequelize.fn('SUM', sequelize.col('days60')), '60'],
      [sequelize.fn('SUM', sequelize.col('days90')), '90'],
      [sequelize.fn('SUM', sequelize.col('days120')), '120'],
      [sequelize.fn('SUM', sequelize.col('days150')), '150'],
      [sequelize.fn('SUM', sequelize.col('days180')), '180'],
      [sequelize.fn('SUM', sequelize.col('days180Over')), '>180'],
    ],
  });

  return reports;
}

async function getAgentPTP(user, password) {
  const db = await connectDB(user, password, 'outcome');
  const reports = await db.findAll({
    attributes: [
      ['createdBy', 'Agent'],
      [sequelize.fn('SUM', sequelize.col('ptpAmount')), 'Sum'],
    ],
    group: 'createdBy',
  });
  return reports;
}

async function getDatePTP(user, password) {
  const db = await connectDB(user, password, 'outcome');
  const reports = await db.findAll({
    attributes: [
      [sequelize.literal('SUBSTRING(ptpDate, 1, 10)'), 'ptpDate'],
      [sequelize.fn('SUM', sequelize.col('ptpAmount')), 'Sum'],
    ],
    where: { ptpDate: { [Op.ne]: null } },
    group: 'ptpDate',
  });
  return reports;
}

async function getAgentActivity(user, password) {
  const sequelize = await tenantdb.connect(user, password);
  const activities = await sequelize.query(
    `SELECT customerName, caseNumber, initialAssignment, outcomes.updatedAt, outcomeResolution, outcomeNotes
    FROM customers, accounts, outcomes RIGHT JOIN cases
    ON cases.caseNumber = outcomes.f_caseNumber
    WHERE customers.customerRefNo = accounts.f_customerRefNo
    AND cases.f_accountNumber = accounts.accountNumber;`,
    { type: QueryTypes.SELECT }
  );
  //console.log('__)_)_)_)_) activities: ', activities);
  return activities;
}

function basicDetails(report) {
  console.log('report: ', report);
  const {
    days30,
    days60,
    days90,
    days120,
    days150,
    days180,
    days180Over,
  } = report;
  return {
    days30,
    days60,
    days90,
    days120,
    days150,
    days180,
    days180Over,
  };
}

// helper functions

async function getAccount(id) {
  const account = await tenantdb.Account.findByPk(id);
  if (!account) throw 'Account not found';
  return account;
}
