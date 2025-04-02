const { DataTypes } = require('sequelize');

/*


CREATE VIEW outcomes AS
SELECT id, outcomeStatus, transactionType, numberCalled, emailUsed, contactPerson, outcomeResolution, ptpDate, ptpAmount, debitResubmissionDate, debitResubmissionAmount, outcomeNotes, nextSteps, createdBy, f_caseNumber, createdAt, updatedAt
FROM tbl_outcomes
WHERE tenant = SUBSTRING_INDEX(USER(), '@', 1);

CREATE TRIGGER tbl_outcomes_tenant_trigger
BEFORE INSERT ON tbl_outcomes
FOR EACH ROW
SET new.tenant = SUBSTRING_INDEX(USER(), '@', 1);
*/

module.exports = model;

function model(sequelize) {
  const attributes = {
    outcomeStatus: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Open',
    },
    transactionType: { type: DataTypes.STRING, allowNull: true },
    numberCalled: { type: DataTypes.STRING, allowNull: true },
    emailUsed: { type: DataTypes.STRING, allowNull: true },
    contactPerson: { type: DataTypes.STRING, allowNull: true },
    outcomeResolution: { type: DataTypes.STRING, allowNull: true },
    ptpDate: { type: DataTypes.DATE, allowNull: true },
    ptpAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.0,
    },
    debitResubmissionDate: { type: DataTypes.DATE, allowNull: true },
    debitResubmissionAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.0,
    },
    outcomeNotes: { type: DataTypes.STRING, allowNull: true },
    nextSteps: { type: DataTypes.STRING, allowNull: true },
    createdBy: { type: DataTypes.STRING, allowNull: false },
    tenant: { type: DataTypes.STRING, allowNull: false },
    f_caseNumber: {
      type: DataTypes.STRING,
      references: { model: db.Case, key: 'caseNumber' },
    },
  };

  /*const options = {
    // disable default timestamp fields (createdAt and updatedAt)
    timestamps: false,
    defaultScope: {
      // exclude password hash by default
      attributes: { exclude: ['passwordHash'] },
    },
    scopes: {
      // include hash with this scope
      withHash: { attributes: {} },
    },
  };*/

  //return sequelize.define('account', attributes, options);
  return sequelize.define('outcome', attributes, { tableName: 'tbl_outcomes' });
}
