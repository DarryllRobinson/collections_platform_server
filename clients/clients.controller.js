const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validateRequest = require("../middleware/validate-request");
const authorise = require("../middleware/authorise");
const Role = require("../helpers/role");
const clientService = require("./client.service");

// routes
router.get("/", authorise(), getAll);
// router.post("/", authorise(), getAll);

module.exports = router;

function getAll(req, res, next) {
  clientService
    .getAll()
    .then((clients) => res.json(clients))
    .catch(next);
}
