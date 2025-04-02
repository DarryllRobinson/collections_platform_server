const dbConfig = require("./config.js");
const mysql = require("mysql2");
const { Sequelize } = require("sequelize");

// Determine which config to use for which environment
let config;

switch (process.env.REACT_APP_STAGE) {
  case "development":
    config = dbConfig.devConfig;
    break;
  case "sit":
    config = dbConfig.sitConfig;
    break;
  case "uat":
    config = dbConfig.uatConfig;
    break;
  case "production":
    config = dbConfig.prodConfig;
    break;
  default:
    config = dbConfig.devConfig;
    break;
}

module.exports = db = {};

initialize();

async function initialize() {
  // create db if it doesn't already exist
  console.log("REACT_APP_STAGE: ", process.env.REACT_APP_STAGE);
  //console.log('Creating db with config: ', config);
  const { host, port, user, password, database } = config;
  const pool = await mysql.createPool({
    connectionLimit: 100,
    host,
    port,
    user,
    password,
  });

  await pool.getConnection((err, connection) => {
    /*process.on('uncaughtException', function (err) {
      console.log(err);
    });*/
    if (err) throw err;

    console.log("!!!!!!!!!!!!!!!!! db connected as id ", connection.threadId);

    connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${database}\`;`,
      (err, result) => {
        //connection.removeListener('error', err);
        //console.log('removed listener for error:', err);
        //connection.release();
        console.log("is this where it is?", result);
        if (err) throw err;
      }
    );
  });

  // connect to db
  console.log("connect to db: ", database, user, password);
  const sequelize = new Sequelize(database, user, password, {
    dialect: "mysql",
    dialectOptions: { decimalNumbers: true },
    host: "localhost",
  });

  // init models and add them to the exported db object
  db.Client = require("../clients/client.model")(sequelize);

  db.User = require("../users/user.model.js")(sequelize);
  db.RefreshToken = require("../users/refresh-token.model.js")(sequelize);

  db.Account = require("../accounts/account.model")(sequelize);
  db.Case = require("../cases/case.model")(sequelize);
  db.Contact = require("../contacts/contact.model")(sequelize);
  db.Customer = require("../customers/customer.model")(sequelize);
  db.Invoice = require("../invoices/invoice.model")(sequelize);
  db.Outcome = require("../outcomes/outcome.model")(sequelize);
  db.Mapping = require("../mappings/mapping.model")(sequelize);

  // define relationships
  // add relationships for clients, customers, accounts, contacts, cases and outcomes
  // including invoices now too
  db.Client.hasMany(
    db.User,
    { foreignKey: "f_clientId" },
    { onDelete: "CASCADE" }
  );

  db.User.belongsTo(
    db.Client,
    { foreignKey: "f_clientId" },
    { targetKey: "id" }
  );
  db.User.hasMany(db.RefreshToken, { onDelete: "CASCADE" });
  db.RefreshToken.belongsTo(db.User);

  // Mapping integration
  db.Client.hasOne(
    db.Mapping,
    { foreignKey: "f_clientId" },
    { onDelete: "CASCADE" }
  );
  db.Mapping.belongsTo(db.Client);

  db.Customer.hasMany(
    db.Invoice,
    { foreignKey: "f_customerRefNo" },
    { onDelete: "CASCADE" }
  );

  db.Invoice.belongsTo(db.Customer, {
    foreignKey: "f_customerRefNo",
    targetKey: "customerRefNo",
  });

  db.Customer.hasMany(
    db.Account,
    { foreignKey: "f_customerRefNo" },
    { onDelete: "CASCADE" }
  );

  db.Account.belongsTo(db.Customer, {
    foreignKey: "f_customerRefNo",
    targetKey: "customerRefNo",
  });

  db.Account.hasMany(
    db.Case,
    {
      foreignKey: "f_accountNumber",
    },
    { onDelete: "CASCADE" }
  );

  db.Account.hasOne(
    db.Contact,
    {
      foreignKey: "f_accountNumber",
    },
    { onDelete: "CASCADE" }
  );

  db.Contact.belongsTo(db.Account, {
    foreignKey: "f_accountNumber",
    targetKey: "accountNumber",
  });

  db.Case.belongsTo(db.Account, {
    foreignKey: "f_accountNumber",
    targetKey: "accountNumber",
  });
  db.Case.hasMany(
    db.Outcome,
    {
      foreignKey: "f_caseNumber",
    },
    { onDelete: "CASCADE" }
  );

  db.Outcome.belongsTo(db.Case, {
    foreignKey: "f_caseNumber",
    targetKey: "caseNumber",
  });

  // sync all models with database
  await sequelize.sync();
  console.log("completed sync");

  // create views
  // Accounts
  /*await sequelize.query(`CREATE OR REPLACE VIEW accounts AS
    SELECT accountNumber, accountName, openDate, debtorAge, paymentTermDays, creditLimit, totalBalance, amountDue, currentBalance, days30, days60, days90, days120, days150, days180, days180Over, paymentMethod, paymentDueDate, debitOrderDate, lastPaymentDate, lastPaymentAmount, lastPTPDate, lastPTPAmount, accountNotes, accountStatus, arg, createdBy, updatedBy, f_customerRefNo, createdAt, updatedAt
    FROM tbl_accounts
    WHERE tenant = SUBSTRING_INDEX(USER(), '@', 1);`);

  // Cases
  await sequelize.query(`CREATE OR REPLACE VIEW cases AS
    SELECT caseNumber, currentAssignment, initialAssignment, caseNotes, kamNotes, currentStatus, pendReason, resolution, caseReason, createdBy, lockedDatetime, reopenedDate, reopenedBy, nextVisitDateTime, reassignedDate, reassignedBy, updatedBy, f_accountNumber, createdAt, updatedAt
    FROM tbl_cases
    WHERE tenant = SUBSTRING_INDEX(USER(), '@', 1);`);

  // Contacts
  await sequelize.query(`CREATE OR REPLACE VIEW contacts AS
    SELECT id, primaryContactName, primaryContactNumber, primaryContactEmail, representativeName, representativeNumber, representativeEmail, alternativeRepName, alternativeRepNumber, alternativeRepEmail, otherNumber1, otherNumber2, otherNumber3, otherNumber4, otherNumber5, otherNumber6, otherNumber7, otherNumber8, otherNumber9, otherNumber10, otherEmail1, otherEmail2, otherEmail3, otherEmail4, otherEmail5, otherEmail6, otherEmail7, otherEmail8, otherEmail9, otherEmail10, dnc1, dnc2, dnc3, dnc4, dnc5, updatedBy, f_accountNumber, createdAt, updatedAt
    FROM tbl_contacts
    WHERE tenant = SUBSTRING_INDEX(USER(), '@', 1);`);

  // Customers
  await sequelize.query(`CREATE OR REPLACE VIEW customers AS
    SELECT operatorShortCode, customerRefNo, customerName, customerEntity, regIdNumber, customerType, productType, address1, address2, address3, address4, address5, createdBy, updatedBy, closedDate, closedBy, regIdStatus, f_clientId, createdAt, updatedAt
    FROM tbl_customers
    WHERE tenant = SUBSTRING_INDEX(USER(), '@', 1);`);

  // Outcomes
  await sequelize.query(`CREATE OR REPLACE VIEW outcomes AS
    SELECT id, outcomeStatus, transactionType, numberCalled, emailUsed, contactPerson, outcomeResolution, ptpDate, ptpAmount, debitResubmissionDate, debitResubmissionAmount, outcomeNotes, nextSteps, createdBy, f_caseNumber, createdAt, updatedAt
    FROM tbl_outcomes
    WHERE tenant = SUBSTRING_INDEX(USER(), '@', 1);`);*/
}
