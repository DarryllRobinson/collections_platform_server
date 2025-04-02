const { DataTypes } = require('sequelize');

/*

CREATE VIEW cases AS
SELECT caseNumber, currentAssignment, initialAssignment, caseNotes, kamNotes, currentStatus, pendReason, resolution, caseReason, createdBy, lockedDatetime, reopenedDate, reopenedBy, nextVisitDateTime, reassignedDate, reassignedBy, updatedBy, f_accountNumber, createdAt, updatedAt
FROM tbl_cases
WHERE tenant = SUBSTRING_INDEX(USER(), '@', 1);

CREATE TRIGGER tbl_cases_tenant_trigger
BEFORE INSERT ON tbl_cases
FOR EACH ROW
SET new.tenant = SUBSTRING_INDEX(USER(), '@', 1);
*/

module.exports = model;

function model(sequelize) {
  const attributes = {
    caseNumber: { type: DataTypes.STRING, primaryKey: true },
    currentAssignment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    initialAssignment: { type: DataTypes.STRING, allowNull: true },
    caseNotes: { type: DataTypes.STRING, allowNull: true },
    kamNotes: { type: DataTypes.STRING, allowNull: true },
    currentStatus: { type: DataTypes.STRING, allowNull: true },
    pendReason: { type: DataTypes.STRING, allowNull: true },
    resolution: { type: DataTypes.STRING, allowNull: true },
    caseReason: { type: DataTypes.STRING, allowNull: true },
    createdBy: { type: DataTypes.STRING, allowNull: false },
    lockedDatetime: { type: DataTypes.DATE, allowNull: true },
    reopenedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    reopenedBy: { type: DataTypes.STRING, allowNull: true },
    nextVisitDateTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    reassignedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    reassignedBy: { type: DataTypes.STRING, allowNull: true },
    updatedBy: { type: DataTypes.STRING, allowNull: true },
    tenant: { type: DataTypes.STRING, allowNull: false },
    f_accountNumber: {
      type: DataTypes.STRING,
      references: { model: db.Account, key: 'accountNumber' },
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
  return sequelize.define('case', attributes, { tableName: 'tbl_cases' });
}
