const { DataTypes } = require('sequelize');

/*
CREATE VIEW contacts AS
SELECT id, primaryContactName, primaryContactNumber, primaryContactEmail, representativeName, representativeNumber, representativeEmail, alternativeRepName, alternativeRepNumber, alternativeRepEmail, otherNumber1, otherNumber2, otherNumber3, otherNumber4, otherNumber5, otherNumber6, otherNumber7, otherNumber8, otherNumber9, otherNumber10, otherEmail1, otherEmail2, otherEmail3, otherEmail4, otherEmail5, otherEmail6, otherEmail7, otherEmail8, otherEmail9, otherEmail10, dnc1, dnc2, dnc3, dnc4, dnc5, updatedBy, f_accountNumber, createdAt, updatedAt
FROM tbl_contacts
WHERE tenant = SUBSTRING_INDEX(USER(), '@', 1);

CREATE TRIGGER tbl_contacts_tenant_trigger
BEFORE INSERT ON tbl_contacts
FOR EACH ROW
SET new.tenant = SUBSTRING_INDEX(USER(), '@', 1);
*/

module.exports = model;

function model(sequelize) {
  const attributes = {
    primaryContactName: { type: DataTypes.STRING, allowNull: true },
    primaryContactNumber: { type: DataTypes.STRING, allowNull: true },
    primaryContactEmail: { type: DataTypes.STRING, allowNull: true },
    representativeName: { type: DataTypes.STRING, allowNull: true },
    representativeNumber: { type: DataTypes.STRING, allowNull: true },
    representativeEmail: { type: DataTypes.STRING, allowNull: true },
    alternativeRepName: { type: DataTypes.STRING, allowNull: true },
    alternativeRepNumber: { type: DataTypes.STRING, allowNull: true },
    alternativeRepEmail: { type: DataTypes.STRING, allowNull: true },
    otherNumber1: { type: DataTypes.STRING, allowNull: true },
    otherNumber2: { type: DataTypes.STRING, allowNull: true },
    otherNumber3: { type: DataTypes.STRING, allowNull: true },
    otherNumber4: { type: DataTypes.STRING, allowNull: true },
    otherNumber5: { type: DataTypes.STRING, allowNull: true },
    otherNumber6: { type: DataTypes.STRING, allowNull: true },
    otherNumber7: { type: DataTypes.STRING, allowNull: true },
    otherNumber8: { type: DataTypes.STRING, allowNull: true },
    otherNumber9: { type: DataTypes.STRING, allowNull: true },
    otherNumber10: { type: DataTypes.STRING, allowNull: true },
    otherEmail1: { type: DataTypes.STRING, allowNull: true },
    otherEmail2: { type: DataTypes.STRING, allowNull: true },
    otherEmail3: { type: DataTypes.STRING, allowNull: true },
    otherEmail4: { type: DataTypes.STRING, allowNull: true },
    otherEmail5: { type: DataTypes.STRING, allowNull: true },
    otherEmail6: { type: DataTypes.STRING, allowNull: true },
    otherEmail7: { type: DataTypes.STRING, allowNull: true },
    otherEmail8: { type: DataTypes.STRING, allowNull: true },
    otherEmail9: { type: DataTypes.STRING, allowNull: true },
    otherEmail10: { type: DataTypes.STRING, allowNull: true },
    dnc1: { type: DataTypes.STRING, allowNull: true },
    dnc2: { type: DataTypes.STRING, allowNull: true },
    dnc3: { type: DataTypes.STRING, allowNull: true },
    dnc4: { type: DataTypes.STRING, allowNull: true },
    dnc5: { type: DataTypes.STRING, allowNull: true },
    updatedBy: { type: DataTypes.STRING, allowNull: true },
    tenant: { type: DataTypes.STRING, allowNull: false },
    f_accountNumber: {
      type: DataTypes.STRING,
      references: { model: db.Account, key: 'accountNumber' },
    },
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

  return sequelize.define('contact', attributes, { tableName: 'tbl_contacts' });
}
