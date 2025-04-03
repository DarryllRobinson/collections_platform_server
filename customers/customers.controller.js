const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validateRequest = require("../middleware/validate-request");
const authorise = require("../middleware/authorise");
const Role = require("../helpers/role");
const customerService = require("./customer.service");

// routes
// router.get('/', authorise(), getAll);
router.get("/", getAll);
router.get("/invoices", authorise(), getCustomerInvoices);
router.get("/:id", authorise(), getById);
router.post("/bulk", authorise(), bulkCreate);
router.post("/", authorise(), createSchema, create);
router.put("/:id", authorise(), updateSchema, update);
router.delete("/:id", authorise(), _delete);

module.exports = router;

function getAll(req, res, next) {
  console.log("******************************* getAll", req.user);
  const { tenant, passwordHash } = req.user;
  customerService
    .getAll(tenant, passwordHash)
    .then((customers) => res.json(customers))
    .catch(next);
}

function getCustomerInvoices(req, res, next) {
  //console.log('******************************* getCustomerInvoices');
  const { tenant, passwordHash } = req.user;
  customerService
    .getCustomerInvoices(tenant, passwordHash)
    .then((customerInvoice) =>
      customerInvoice ? res.json(customerInvoice) : res.sendStatus(404)
    )
    .catch(next);
}

function getById(req, res, next) {
  const { tenant, passwordHash } = req.user;
  customerService
    .getById(req.params.id, tenant, passwordHash)
    .then((customer) => (customer ? res.json(customer) : res.sendStatus(404)))
    .catch(next);
}

function createSchema(req, res, next) {
  const schema = Joi.object({
    operatorShortCode: Joi.string(),
    customerRefNo: Joi.string().required(),
    customerName: Joi.string().required(),
    customerEntity: Joi.string().required(),
    regIdNumber: Joi.string(),
    customerType: Joi.string(),
    productType: Joi.string(),
    address1: Joi.string(),
    address2: Joi.string(),
    address3: Joi.string(),
    address4: Joi.string(),
    address5: Joi.string(),
    createdDate: Joi.date(),
    createdBy: Joi.string().required(),
    updatedDate: Joi.date(),
    updatedBy: Joi.string(),
    closedDate: Joi.date(),
    closedBy: Joi.string(),
    regIdStatus: Joi.string(),
    f_clientId: Joi.number().required(),
  });
  validateRequest(req, next, schema);
}

function bulkCreate(req, res, next) {
  const { tenant, passwordHash } = req.user;
  customerService
    .bulkCreate(req.body, tenant, passwordHash)
    .then((customer) => res.json(customer))
    .catch(next);
}

function create(req, res, next) {
  const { tenant, passwordHash } = req.user;
  customerService
    .create(req.body, tenant, passwordHash)
    .then((customer) => res.json(customer))
    .catch(next);
}

function updateSchema(req, res, next) {
  const schemaRules = {
    operatorShortCode: Joi.string(),
    customerRefNo: Joi.string().required(),
    customerName: Joi.string().required(),
    customerEntity: Joi.string().required(),
    regIdNumber: Joi.string(),
    customerType: Joi.string(),
    productType: Joi.string(),
    address1: Joi.string(),
    address2: Joi.string(),
    address3: Joi.string(),
    address4: Joi.string(),
    address5: Joi.string(),
    createdDate: Joi.date().required(),
    createdBy: Joi.string().required(),
    updatedDate: Joi.date(),
    updatedBy: Joi.string(),
    closedDate: Joi.date(),
    closedBy: Joi.string(),
    regIdStatus: Joi.string(),
    f_clientId: Joi.number().required(),
  };
  validateRequest(req, next, schema);
}

function update(req, res, next) {
  const { tenant, passwordHash } = req.user;
  customerService
    .update(req.params.id, req.body, tenant, passwordHash)
    .then((customer) => res.json(customer))
    .catch(next);
}

function _delete(req, res, next) {
  const { tenant, passwordHash } = req.user;
  customerService
    .delete(req.params.id, tenant, passwordHash)
    .then(() => res.json({ message: "Customer deleted successfully" }))
    .catch(next);
}
