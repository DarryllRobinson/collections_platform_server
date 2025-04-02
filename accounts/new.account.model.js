const account_view = `SELECT * FROM accounts;`;

module.exports = {
  up: function (database, Sequelize) {
    return database.query(`CREATE VIEW ${account_view} AS ${query};`);
  },
  down: function (database, Sequelize) {
    return database.query(`DROP VIEW ${account_view};`);
  },
};

CREATE VIEW thesystem_db.accounts AS
    SELECT accountNumber, accountName, openDate, debtorAge, paymentTermDays, creditLimit, totalBalance, amountDue, currentBalance, days30, days60, days90, days120, days150, days180, days180Over, paymentMethod, paymentDueDate, debitOrderDate, lastPaymentDate, lastPaymentAmount, lastPTPDate, lastPTPAmount, accountNotes, accountStatus, arg, createdBy, updatedBy, f_customerRefNo, createdAt, updatedAt
    FROM thesystem_db.tbl_accounts
    WHERE tenant = SUBSTRING_INDEX(USER(), '@', 1);
