const config = require("../helpers/tenant.config.js");
const { stripe_secret } = config;
const stripe = require("stripe")(stripe_secret);

module.exports = { postCharge };

async function postCharge(paymentDetails) {
  console.log("postCharge", paymentDetails);
  try {
    const { amount, source, receipt_email } = paymentDetails;

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
    /*res.status(500).json({
      message: error.message,
    });*/
  }
}
