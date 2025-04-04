const tenantdb = require("../helpers/tenant.db");
const tenantConfig = require("../helpers/tenant.config");
const db = require("../helpers/db");
const { QueryTypes } = require("sequelize");

module.exports = {
  getAll,
  getSnapshot,
  getById,
  getCustomerInvoices,
  bulkCreate,
  create,
  update,
  delete: _delete,
};

// async function connectDB(user, password, db) {
//   const sequelize = await tenantdb.connect(user, password);
//   return require(`../${db}s/${db}.model`)(sequelize);
// }

// async function getAll(user, password) {
//   try {
//     const db = await connectDB(user, password, 'customer');
//     const customers = await db.findAll();
//     return customers.map((x) => basicDetails(x));
//   } catch (err) {
//     console.log('customerService.getAll error: ', err);
//   }
// }

async function getAll() {
  try {
    const customers = await db.Customer.findAll();
    return customers.map((x) => basicDetails(x));
  } catch (err) {
    console.log("customerService.getAll error: ", err);
  }
}

async function getSnapshot() {
  try {
    const sequelize = await tenantdb.connect(
      tenantConfig.devConfig.user,
      tenantConfig.devConfig.password
    );
    const snapshot = await sequelize.query(
      `SELECT customerRefNo, customerName AS "Customer Name", amountDue,
      accountNumber AS "Account Number", creditLimit AS "Credit Limit",
      currentBalance AS "Current Balance", debtorAge AS "Debtor Age",
      totalBalance AS "Total Balance"
      FROM tbl_customers, tbl_accounts
      WHERE customerRefNo = f_customerRefNo`,
      { type: QueryTypes.SELECT }
    );
    return snapshot;
  } catch (error) {
    console.error("Error with getSnapshot customer.service: ", error);
    throw error;
  }
}

async function getById(id, user, password) {
  const customer = await getCustomer(id, user, password);
  return basicDetails(customer);
}

async function getCustomerInvoices(user, password) {
  //const customerInvoices = await db.Customer.findAll();
  const sequelize = await tenantdb.connect(user, password);
  const customerInvoices = await sequelize.query(
    `SELECT customerRefNo, customerName, viewed, totalBalance
    FROM customers, invoices
    WHERE customerRefNo = f_customerRefNo`,
    { type: QueryTypes.SELECT }
    /*db.findAll({
    attributes: ['customerRefNo', 'customerName'],
    include: [
      {
        model: db.Invoice,
        attributes: ['hasViewed', 'viewed', 'totalBalance'],
      },
    ],
  });*/
  );
  //console.log('customerInvoices done: ', JSON.stringify(customerInvoices));
  return customerInvoices; //.map((x) => customerInvoicesDetails(x));
}

function customerInvoicesDetails(invoice) {
  /*if (invoice.customerRefNo === 'AEO101')
    console.log('invoice: ', JSON.stringify(invoice));
  if (invoice.customerRefNo === 'AIM101')
    console.log('invoice: ', JSON.stringify(invoice));*/
  if (invoice.invoices.length > 0) {
    const {
      customerRefNo,
      customerName,
      invoices: [{ hasViewed, viewed, totalBalance }],
    } = invoice;
    return { customerRefNo, customerName, hasViewed, viewed, totalBalance };
  } else {
    const { customerRefNo, customerName } = invoice;
    return { customerRefNo, customerName };
  }
}

async function bulkCreate(params, user, password) {
  // Count existing rows to be able to count number of affected rows
  const db = await connectDB(user, password, "customer");
  //console.log('**************** bulkCreate', params);
  const existingRows = await db.count({ distinct: "customerRefNo" });
  //console.log('**************** bulkCreate', existingRows);
  await db.bulkCreate(params);
  const totalRows = await db.count({ distinct: "customerRefNo" });

  return totalRows - existingRows;
}

async function create(params, user, password) {
  const db = await connectDB(user, password, "customer");
  // validate
  if (await db.findOne({ where: { customerName: params.customerName } })) {
    throw 'Customer "' + params.customerName + '" is already registered';
  }

  const customer = new db(params);

  // save customer
  await customer.save();

  return basicDetails(customer);
}

async function update(id, params, user, password) {
  const db = await connectDB(user, password, "customer");
  const customer = await getCustomer(id, user, password);

  // validate (if email was changed)
  if (
    params.customerName &&
    customer.customerName !== params.customerName &&
    (await db.findOne({
      where: { customerName: params.customerName },
    }))
  ) {
    throw 'Customer "' + params.customerName + '" is already taken';
  }

  // copy params to customer and save
  Object.assign(customer, params);
  customer.updated = Date.now();
  await customer.save();

  return basicDetails(customer);
}

async function _delete(id, user, password) {
  const customer = await getCustomer(id, user, password);
  await customer.destroy();
}

// helper functions

async function getCustomer(id, user, password) {
  console.log("here I am");
  const db = await connectDB(user, password, "customer");
  const customer = await db.findByPk(id);
  if (!customer) throw "Customer not found";
  return customer;
}

function basicDetails(customer) {
  const {
    operatorShortCode,
    customerRefNo,
    customerName,
    customerEntity,
    regIdNumber,
    customerType,
    productType,
    address1,
    address2,
    address3,
    address4,
    address5,
    createdAt,
    createdBy,
    updatedAt,
    updatedBy,
    closedDate,
    closedBy,
    regIdStatus,
    f_clientId,
  } = customer;
  return {
    operatorShortCode,
    customerRefNo,
    customerName,
    customerEntity,
    regIdNumber,
    customerType,
    productType,
    address1,
    address2,
    address3,
    address4,
    address5,
    createdAt,
    createdBy,
    updatedAt,
    updatedBy,
    closedDate,
    closedBy,
    regIdStatus,
    f_clientId,
  };
}
