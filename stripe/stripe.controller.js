const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validateRequest = require("../middleware/validate-request");
const authorise = require("../middleware/authorise");

const config = require("../helpers/tenant.config.js");
const { stripe_secret } = config;
const stripe = require("stripe")(stripe_secret);

// routes
router.post("/charge", authorise(), paymentSchema, makePaymentRequest);

module.exports = router;

function paymentSchema(req, res, next) {
  const schema = Joi.object({
    amount: Joi.number(),
    source: Joi.string(),
    receipt_email: Joi.string(),
  });
  validateRequest(req, next, schema);
}

async function makePaymentRequest(req, res, next) {
  try {
    const { amount, source, receipt_email } = req.body;

    const charge = await stripe.charges.create({
      amount,
      currency: "usd",
      source,
      receipt_email,
    });

    if (!charge) throw new Error("charge unsuccessful");

    console.log("charge created");
    res.status(200).json({
      charge,
      message: "charge posted successfully",
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message: error.message,
    });
  }
}
