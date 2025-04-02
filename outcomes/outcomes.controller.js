const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../middleware/validate-request');
const authorise = require('../middleware/authorise');
const outcomeService = require('./outcome.service');

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
  outcomeService
    .getAll(tenant, passwordHash)
    .then((outcomes) => {
      res.json(outcomes);
    })
    .catch(next);
}

function getById(req, res, next) {
  // returns all outcomes based on caseNumber
  const { tenant, passwordHash } = req.user;
  outcomeService
    .getById(req.params.id, tenant, passwordHash)
    .then((outcome) => {
      outcome ? res.json(outcome) : res.sendStatus(404);
    })
    .catch(next);
}

function createSchema(req, res, next) {
  const schema = Joi.object({
    outcomeStatus: Joi.string(),
    transactionType: Joi.string(),
    //numberCalled: Joi.string(),
    //emailUsed: Joi.string(),
    contactPerson: Joi.string(),
    outcomeResolution: Joi.string(),
    ptpDate: Joi.date(),
    ptpAmount: Joi.number().precision(2),
    debitResubmissionDate: Joi.date(),
    debitResubmissionAmount: Joi.number().precision(2),
    outcomeNotes: Joi.string(),
    nextSteps: Joi.string(),
    createdBy: Joi.string(),
    f_caseNumber: Joi.string(),
  });
  validateRequest(req, next, schema);
}

function bulkCreate(req, res, next) {
  const { tenant, passwordHash } = req.user;
  outcomeService
    .bulkCreate(req.body, tenant, passwordHash)
    .then((outcome) => res.json(outcome))
    .catch(next);
}

function create(req, res, next) {
  //console.log('**************** create controller: ', req.user);
  const { tenant, passwordHash } = req.user;
  outcomeService
    .create(req.body, tenant, passwordHash)
    .then((outcome) => res.json(outcome))
    .catch(next);
}

function updateSchema(req, res, next) {
  const schema = Joi.object({
    outcomeStatus: Joi.string(),
    transactionType: Joi.string(),
    numberCalled: Joi.string(),
    emailUsed: Joi.string(),
    contactPerson: Joi.string(),
    outcomeResolution: Joi.string(),
    ptpDate: Joi.date(),
    ptpAmount: Joi.number().precision(2),
    debitResubmissionDate: Joi.date(),
    debitResubmissionAmount: Joi.number().precision(2),
    outcomeNotes: Joi.string(),
    nextSteps: Joi.string(),
    createdBy: Joi.string().required(),
    f_caseNumber: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

function update(req, res, next) {
  const { tenant, passwordHash } = req.user;
  outcomeService
    .update(req.params.id, req.body, tenant, passwordHash)
    .then((outcome) => res.json(outcome))
    .catch(next);
}

function _delete(req, res, next) {
  const { tenant, passwordHash } = req.user;
  outcomeService
    .delete(req.params.id, tenant, passwordHash)
    .then(() => res.json({ message: 'Outcome deleted successfully' }))
    .catch(next);
}
