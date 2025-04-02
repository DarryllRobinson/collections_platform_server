const { DataTypes } = require('sequelize');

/*
CREATE VIEW mappings AS
SELECT id, primaryMappingName, primaryMappingNumber, primaryMappingEmail, representativeName, representativeNumber, representativeEmail, alternativeRepName, alternativeRepNumber, alternativeRepEmail, otherNumber1, otherNumber2, otherNumber3, otherNumber4, otherNumber5, otherNumber6, otherNumber7, otherNumber8, otherNumber9, otherNumber10, otherEmail1, otherEmail2, otherEmail3, otherEmail4, otherEmail5, otherEmail6, otherEmail7, otherEmail8, otherEmail9, otherEmail10, dnc1, dnc2, dnc3, dnc4, dnc5, updatedBy, f_accountNumber, createdAt, updatedAt
FROM tbl_mappings
WHERE tenant = SUBSTRING_INDEX(USER(), '@', 1);

CREATE TRIGGER tbl_mappings_tenant_trigger
BEFORE INSERT ON tbl_mappings
FOR EACH ROW
SET new.tenant = SUBSTRING_INDEX(USER(), '@', 1);
*/

module.exports = model;

function model(sequelize) {
  const attributes = {
    table: { type: DataTypes.STRING, allowNull: true },
    db_field: { type: DataTypes.STRING, allowNull: true },
    web_field: { type: DataTypes.STRING, allowNull: true },
    createdAt: { type: DataTypes.STRING, allowNull: true },
    createdBy: { type: DataTypes.STRING, allowNull: true },
    updatedBy: { type: DataTypes.STRING, allowNull: true },
    tenant: { type: DataTypes.STRING, allowNull: false },
  };

  const options = {};

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

  return sequelize.define('mapping', attributes, { tableName: 'tbl_mappings' });
}
