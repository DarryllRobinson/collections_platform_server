const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../middleware/validate-request');
const authorise = require('../middleware/authorise');
const caseService = require('./case.service');

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
  caseService
    .getAll(tenant, passwordHash)
    .then((cases) => res.json(cases))
    .catch(next);
}

function getById(req, res, next) {
  const { tenant, passwordHash } = req.user;
  caseService
    .getById(req.params.id, tenant, passwordHash)
    .then((caseObject) =>
      caseObject ? res.json(caseObject) : res.sendStatus(404)
    )
    .catch(next);
}

function createSchema(req, res, next) {
  const schema = Joi.object({
    caseNumber: Joi.string().required(),
    currentAssignment: Joi.string().required(),
    initialAssignment: Joi.string(),
    caseNotes: Joi.string(),
    kamNotes: Joi.string(),
    currentStatus: Joi.string(),
    pendReason: Joi.string(),
    resolution: Joi.string(),
    caseReason: Joi.string(),
    lockedDatetime: Joi.date(),
    createdBy: Joi.string().required(),
    reassignedDate: Joi.date(),
    reassignedBy: Joi.string(),
    reopenedDate: Joi.date(),
    reopenedBy: Joi.string(),
    updatedDate: Joi.date(),
    updatedBy: Joi.string(),
    f_accountNumber: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

function bulkCreate(req, res, next) {
  const { tenant, passwordHash } = req.user;
  caseService
    .bulkCreate(req.body, tenant, passwordHash)
    .then((caseObject) => res.json(caseObject))
    .catch(next);
}

function create(req, res, next) {
  const { tenant, passwordHash } = req.user;
  caseService
    .create(req.body, tenant, passwordHash)
    .then((caseObject) => res.json(caseObject))
    .catch(next);
}

function updateSchema(req, res, next) {
  const schema = Joi.object({
    caseNumber: Joi.string(),
    currentAssignment: Joi.string().allow(null),
    initialAssignment: Joi.string(),
    caseNotes: Joi.string().allow(null),
    kamNotes: Joi.string().allow(null),
    currentStatus: Joi.string(),
    pendReason: Joi.string(),
    resolution: Joi.string(),
    caseReason: Joi.string(),
    lockedDatetime: Joi.date(),
    nextVisitDateTime: Joi.date().allow(null),
    createdBy: Joi.string(),
    reassignedDate: Joi.date(),
    reassignedBy: Joi.string(),
    reopenedDate: Joi.date(),
    reopenedBy: Joi.string(),
    updatedDate: Joi.date(),
    updatedBy: Joi.string(),
    f_accountNumber: Joi.string(),
  });
  validateRequest(req, next, schema);
}

function update(req, res, next) {
  const { tenant, passwordHash } = req.user;
  caseService
    .update(req.params.id, req.body, tenant, passwordHash)
    .then((caseObject) => res.json(caseObject))
    .catch(next);
}

function _delete(req, res, next) {
  const { tenant, passwordHash } = req.user;
  caseService
    .delete(req.params.id, tenant, passwordHash)
    .then(() => res.json({ message: 'Case deleted successfully' }))
    .catch(next);
}
