const express = require('express');
const router = express.Router();
const authorise = require('../middleware/authorise');
const reportService = require('./report.service');

// routes
router.get('/aging', authorise(), getAging);
router.get('/agentPTP', authorise(), getAgentPTP);
router.get('/datePTP', authorise(), getDatePTP);
router.get('/agentActivity', authorise(), getAgentActivity);

module.exports = router;

function getAging(req, res, next) {
  //console.log('getAging', req.user);
  const { tenant, passwordHash } = req.user;
  reportService
    .getAging(tenant, passwordHash)
    //.getAgingFromView(tenant, passwordHash)
    .then((reports) => res.json(reports))
    .catch(next);
}

function getAgentPTP(req, res, next) {
  //console.log('getAgentPTP controller', req.user);
  const { tenant, passwordHash } = req.user;
  reportService
    .getAgentPTP(tenant, passwordHash)
    .then((reports) => res.json(reports))
    .catch(next);
}

function getDatePTP(req, res, next) {
  //console.log('getDatePTP', req.user);
  const { tenant, passwordHash } = req.user;
  reportService
    .getDatePTP(tenant, passwordHash)
    .then((reports) => res.json(reports))
    .catch(next);
}

function getAgentActivity(req, res, next) {
  //console.log('**********&&&&&&&&&&&&********** getAgentActivity controller');
  const { tenant, passwordHash } = req.user;
  reportService
    .getAgentActivity(tenant, passwordHash)
    .then((reports) => res.json(reports))
    .catch(next);
}
