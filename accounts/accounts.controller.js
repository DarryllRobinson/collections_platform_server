const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validateRequest = require("../middleware/validate-request");
const authorise = require("../middleware/authorise");
const accountService = require("./account.service");

// routes
router.get("/", authorise(), getAll);
router.get("/:id", authorise(), getById);
router.post("/bulk", authorise(), bulkCreate);
router.post("/", authorise(), createSchema, create);
router.put("/:id", authorise(), updateSchema, update);
router.delete("/:id", authorise(), _delete);
router.get("/customer/:id", authorise(), getAllByCustomerRefNo);

module.exports = router;

function getAll(req, res, next) {
  // const { tenant, passwordHash } = req.user;
  accountService
    .getAll()
    .then((accounts) => res.json(accounts))
    .catch(next);
}

function getById(req, res, next) {
  // const { tenant, passwordHash } = req.user;
  accountService
    .getById(req.params.id)
    .then((account) => (account ? res.json(account) : res.sendStatus(404)))
    .catch(next);
}

function getAllByCustomerRefNo(req, res, next) {
  //console.log('******************************* getAllByCustomerRefNo');
  // const { tenant, passwordHash } = req.user;
  accountService
    .getAllByCustomerRefNo(req.params.id)
    .then((accounts) => (accounts ? res.json(accounts) : res.sendStatus(404)))
    .catch(next);
}

function createSchema(req, res, next) {
  const schema = Joi.object({
    accountNumber: Joi.string().required(),
    accountName: Joi.string().required(),
    openDate: Joi.date(),
    debtorAge: Joi.number(),
    paymentTermDays: Joi.number(),
    creditLimit: Joi.number().precision(2),
    totalBalance: Joi.number().precision(2),
    amountDue: Joi.number().precision(2),
    currentBalance: Joi.number().precision(2),
    days30: Joi.number().precision(2),
    days60: Joi.number().precision(2),
    days90: Joi.number().precision(2),
    days120: Joi.number().precision(2),
    days150: Joi.number().precision(2),
    days180: Joi.number().precision(2),
    days180Over: Joi.number().precision(2),
    paymentMethod: Joi.string(),
    paymentDueDate: Joi.number().precision(2),
    debitOrderDate: Joi.number().precision(2),
    lastPaymentDate: Joi.date(),
    lastPaymentAmount: Joi.number().precision(2),
    lastPTPDate: Joi.date(),
    lastPTPAmount: Joi.number().precision(2),
    accountNotes: Joi.string(),
    accountStatus: Joi.string(),
    arg: Joi.string(),
    createdBy: Joi.string().required(),
    updatedBy: Joi.string(),
  });
  validateRequest(req, next, schema);
}

function bulkCreate(req, res, next) {
  //console.log('**************** bulkCreate controller', req.body);
  const { tenant, passwordHash } = req.user;
  accountService
    .bulkCreate(req.body, tenant, passwordHash)
    .then((account) => res.json(account))
    .catch(next);
}

function create(req, res, next) {
  const { tenant, passwordHash } = req.user;
  accountService
    .create(req.body, tenant, passwordHash)
    .then((account) => res.json(account))
    .catch(next);
}

function updateSchema(req, res, next) {
  const schema = Joi.object({
    accountNumber: Joi.string(),
    accountName: Joi.string(),
    openDate: Joi.date(),
    debtorAge: Joi.number(),
    paymentTermDays: Joi.number(),
    creditLimit: Joi.number().precision(2),
    totalBalance: Joi.number().precision(2),
    amountDue: Joi.number().precision(2),
    currentBalance: Joi.number().precision(2),
    days30: Joi.number().precision(2),
    days60: Joi.number().precision(2),
    days90: Joi.number().precision(2),
    days120: Joi.number().precision(2),
    days150: Joi.number().precision(2),
    days180: Joi.number().precision(2),
    days180Over: Joi.number().precision(2),
    paymentMethod: Joi.string(),
    paymentDueDate: Joi.number().precision(2),
    debitOrderDate: Joi.number().precision(2),
    lastPaymentDate: Joi.date(),
    lastPaymentAmount: Joi.number().precision(2),
    lastPTPDate: Joi.date(),
    lastPTPAmount: Joi.number().precision(2),
    accountNotes: Joi.string(),
    accountStatus: Joi.string(),
    arg: Joi.string(),
    createdBy: Joi.string(),
    updatedBy: Joi.string(),
  });
  validateRequest(req, next, schema);
}

function update(req, res, next) {
  //console.log('**************** update controller: ', req.body, req.user);
  const { tenant, passwordHash } = req.user;
  accountService
    .update(req.params.id, req.body, tenant, passwordHash)
    .then((account) => res.json(account))
    .catch(next);
}

function _delete(req, res, next) {
  const { tenant, passwordHash } = req.user;
  accountService
    .delete(req.params.id, tenant, passwordHash)
    .then(() => res.json({ message: "Account deleted successfully" }))
    .catch(next);
}
