const express = require('express');
const router = express.Router();
const authorise = require('../middleware/authorise');
const queueService = require('./queue.service');

// routes
router.get('/', authorise(), getAll);

module.exports = router;

function getAll(req, res, next) {
  const { tenant, passwordHash } = req.user;
  queueService
    .getAll(tenant, passwordHash)
    .then((queues) => res.json(queues))
    .catch(next);
}
