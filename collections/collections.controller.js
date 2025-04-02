const express = require('express');
const router = express.Router();
const authorise = require('../middleware/authorise');
const collectionService = require('./collection.service');

// routes
router.get('/', authorise(), getAll);
router.get('/:id', authorise(), getCollection);
router.put('/:id', authorise(), updateCollection);

module.exports = router;

function getAll(req, res, next) {
  //console.log('collections getAll');
  const { tenant, passwordHash } = req.user;
  collectionService
    .getAll(tenant, passwordHash)
    .then((collections) => res.json(collections))
    .catch(next);
}

function getCollection(req, res, next) {
  const { tenant, passwordHash } = req.user;
  collectionService
    .getCollection(req.params.id, tenant, passwordHash)
    .then((collection) => res.json(collection))
    .catch(next);
}

function updateCollection(req, res, next) {
  const { tenant, passwordHash } = req.user;
  collectionService
    .updateCollection(req.params.id, req.body, tenant, passwordHash)
    .then((collection) => res.json(collection))
    .catch(next);
}
