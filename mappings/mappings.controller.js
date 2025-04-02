const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../middleware/validate-request');
const authorise = require('../middleware/authorise');
const Role = require('../helpers/role');
const mappingService = require('./mapping.service');

// routes
router.get('/', authorise(), getAll);
router.get('/:id', authorise(), getById);
router.post('/bulk', authorise(), bulkCreate);
router.post('/', authorise(), createSchema, create);
router.put('/', authorise(), updateSchema, update);
router.delete('/:id', authorise(), _delete);

module.exports = router;

function getAll(req, res, next) {
  const { tenant, passwordHash } = req.user;
  mappingService
    .getAll(tenant, passwordHash)
    .then((mappings) => res.json(mappings))
    .catch(next);
}

function getById(req, res, next) {
  const { tenant, passwordHash } = req.user;
  mappingService
    .getById(req.params.id, tenant, passwordHash)
    .then((mapping) => (mapping ? res.json(mapping) : res.sendStatus(404)))
    .catch(next);
}

function createSchema(req, res, next) {
  console.log(
    '********************************** createSchema: ',
    JSON.stringify(req.body)
  );

  const schema = Joi.object({
    table: Joi.string(),
    db_field: Joi.string(),
    web_field: Joi.string(),
    createdAt: Joi.string(),
    createdBy: Joi.string(),
    updatedBy: Joi.string(),
    tenant: Joi.string(),
  });

  const old_schema = Joi.object({
    primaryMappingName: Joi.string(),
    primaryMappingNumber: Joi.string(),
    primaryMappingEmail: Joi.string(),
    representativeName: Joi.string(),
    representativeNumber: Joi.string(),
    representativeEmail: Joi.string(),
    alternativeRepName: Joi.string(),
    alternativeRepNumber: Joi.string(),
    alternativeRepEmail: Joi.string(),
    otherNumber1: Joi.string(),
    otherNumber2: Joi.string(),
    otherNumber3: Joi.string(),
    otherNumber4: Joi.string(),
    otherNumber5: Joi.string(),
    otherNumber6: Joi.string(),
    otherNumber7: Joi.string(),
    otherNumber8: Joi.string(),
    otherNumber9: Joi.string(),
    otherNumber10: Joi.string(),
    otherEmail1: Joi.string(),
    otherEmail2: Joi.string(),
    otherEmail3: Joi.string(),
    otherEmail4: Joi.string(),
    otherEmail5: Joi.string(),
    otherEmail6: Joi.string(),
    otherEmail7: Joi.string(),
    otherEmail8: Joi.string(),
    otherEmail9: Joi.string(),
    otherEmail10: Joi.string(),
    dnc1: Joi.string(),
    dnc2: Joi.string(),
    dnc3: Joi.string(),
    dnc4: Joi.string(),
    dnc5: Joi.string(),
    createdDate: Joi.date().required(),
    createdBy: Joi.string().required(),
    updatedDate: Joi.date(),
    updatedBy: Joi.string(),
    f_accountNumber: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

function bulkCreate(req, res, next) {
  const { tenant, passwordHash } = req.user;
  mappingService
    .bulkCreate(req.body, tenant, passwordHash)
    .then((mapping) => res.json(mapping))
    .catch(next);
}

function create(req, res, next) {
  const { tenant, passwordHash } = req.user;
  mappingService
    .create(req.body, tenant, passwordHash)
    .then((mapping) => res.json(mapping))
    .catch(next);
}

function updateSchema(req, res, next) {
  console.log('updateSchema: ', req.body);
  const schema = Joi.object({
    // accounts
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

    // contacts
    primaryMappingName: Joi.string(),
    primaryMappingNumber: Joi.string(),
    primaryMappingEmail: Joi.string(),
    representativeName: Joi.string(),
    representativeNumber: Joi.string(),
    representativeEmail: Joi.string(),
    alternativeRepName: Joi.string(),
    alternativeRepNumber: Joi.string(),
    alternativeRepEmail: Joi.string(),
    otherNumber1: Joi.string(),
    otherNumber2: Joi.string(),
    otherNumber3: Joi.string(),
    otherNumber4: Joi.string(),
    otherNumber5: Joi.string(),
    otherNumber6: Joi.string(),
    otherNumber7: Joi.string(),
    otherNumber8: Joi.string(),
    otherNumber9: Joi.string(),
    otherNumber10: Joi.string(),
    otherEmail1: Joi.string(),
    otherEmail2: Joi.string(),
    otherEmail3: Joi.string(),
    otherEmail4: Joi.string(),
    otherEmail5: Joi.string(),
    otherEmail6: Joi.string(),
    otherEmail7: Joi.string(),
    otherEmail8: Joi.string(),
    otherEmail9: Joi.string(),
    otherEmail10: Joi.string(),
    dnc1: Joi.string(),
    dnc2: Joi.string(),
    dnc3: Joi.string(),
    dnc4: Joi.string(),
    dnc5: Joi.string(),
    createdBy: Joi.string(),
    updatedDate: Joi.date(),
    updatedBy: Joi.string(),
  });
  validateRequest(req, next, schema);
}

function update(req, res, next) {
  console.log('update: ', req.body);
  const { tenant, passwordHash } = req.user;
  mappingService
    .update(req.params.id, req.body, tenant, passwordHash)
    .then((mapping) => res.json(mapping))
    .catch(next);
}

function _delete(req, res, next) {
  const { tenant, passwordHash } = req.user;
  mappingService
    .delete(req.params.id, tenant, passwordHash)
    .then(() => res.json({ message: 'Mapping deleted successfully' }))
    .catch(next);
}
