const { DataTypes } = require("sequelize");

/*
CREATE VIEW customers AS
SELECT operatorShortCode, customerRefNo, customerName, customerEntity, regIdNumber, customerType, productType, address1, address2, address3, address4, address5, createdBy, updatedBy, closedDate, closedBy, regIdStatus, f_clientId, createdAt, updatedAt
FROM thesystem_db.tbl_customers
WHERE tenant = SUBSTRING_INDEX(USER(), '@', 1);

CREATE TRIGGER tbl_customers_tenant_trigger
BEFORE INSERT ON thesystem_db.tbl_customers
FOR EACH ROW
SET new.tenant = SUBSTRING_INDEX(USER(), '@', 1);
*/

module.exports = model;

function model(sequelize) {
  const attributes = {
    customerRefNo: { type: DataTypes.STRING, primaryKey: true },
    customerName: { type: DataTypes.STRING, allowNull: false },
    customerEntity: { type: DataTypes.STRING, allowNull: false },
    regIdNumber: { type: DataTypes.STRING, allowNull: true },
    address1: { type: DataTypes.STRING, allowNull: true },
    address2: { type: DataTypes.STRING, allowNull: true },
    address3: { type: DataTypes.STRING, allowNull: true },
    address4: { type: DataTypes.STRING, allowNull: true },
    address5: { type: DataTypes.STRING, allowNull: true },
    createdBy: { type: DataTypes.STRING, allowNull: false },
    updatedBy: { type: DataTypes.STRING, allowNull: true },
    closedDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    closedBy: { type: DataTypes.STRING, allowNull: true },
    regIdStatus: { type: DataTypes.STRING, allowNull: true },
    tenant: { type: DataTypes.STRING, allowNull: false },
    f_clientId: { type: DataTypes.INTEGER, allowNull: false },
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
  return sequelize.define("customer", attributes, {
    tableName: "tbl_customers",
  });
}
