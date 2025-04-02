const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
  const attributes = {
    invoiceToken: { type: DataTypes.STRING },
    viewed: { type: DataTypes.DATE },
    hasViewed: {
      type: DataTypes.VIRTUAL,
      get() {
        return !!this.viewed;
      },
    },
    invoiceLocation: { type: DataTypes.STRING },
    totalBalance: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    datePaid: { type: DataTypes.DATE, allowNull: true, defaultValue: null },
    created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated: { type: DataTypes.DATE },
    f_customerRefNo: { type: DataTypes.STRING },
  };

  const options = {
    // disable default timestamp fields (createdAt and updatedAt)
    timestamps: false,
  };

  return sequelize.define('invoice', attributes, options);
}
