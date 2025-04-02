const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../middleware/validate-request');
const authorise = require('../middleware/authorise');
const Role = require('../helpers/role');
const contactService = require('./contact.service');

// routes
router.get('/', authorise(), getAll);
router.get('/:id', authorise(), getById);
router.post('/bulk', authorise(), bulkCreate);
router.post('/', authorise(), createSchema, create);
router.put('/:id', authorise(), updateSchema, update);
router.delete('/:id', authorise(), _delete);

module.exports = router;

function getAll(req, res, next) {
  const { tenant, passwordHash } = req.user;
  contactService
    .getAll(tenant, passwordHash)
    .then((contacts) => res.json(contacts))
    .catch(next);
}

function getById(req, res, next) {
  const { tenant, passwordHash } = req.user;
  contactService
    .getById(req.params.id, tenant, passwordHash)
    .then((contact) => (contact ? res.json(contact) : res.sendStatus(404)))
    .catch(next);
}

function createSchema(req, res, next) {
  const schema = Joi.object({
    primaryContactName: Joi.string(),
    primaryContactNumber: Joi.string(),
    primaryContactEmail: Joi.string(),
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
  contactService
    .bulkCreate(req.body, tenant, passwordHash)
    .then((contact) => res.json(contact))
    .catch(next);
}

function create(req, res, next) {
  const { tenant, passwordHash } = req.user;
  contactService
    .create(req.body, tenant, passwordHash)
    .then((contact) => res.json(contact))
    .catch(next);
}

function updateSchema(req, res, next) {
  const schema = Joi.object({
    primaryContactName: Joi.string(),
    primaryContactNumber: Joi.string(),
    primaryContactEmail: Joi.string(),
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
  const { tenant, passwordHash } = req.user;
  contactService
    .update(req.params.id, req.body, tenant, passwordHash)
    .then((contact) => res.json(contact))
    .catch(next);
}

function _delete(req, res, next) {
  const { tenant, passwordHash } = req.user;
  contactService
    .delete(req.params.id, tenant, passwordHash)
    .then(() => res.json({ message: 'Contact deleted successfully' }))
    .catch(next);
}
