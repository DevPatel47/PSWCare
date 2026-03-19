const Stripe = require("stripe");

const getStripeClient = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is required for payment operations");
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

const createPaymentIntent = async ({
  amount,
  currency = "cad",
  metadata = {},
}) => {
  const stripe = getStripeClient();

  return stripe.paymentIntents.create({
    amount,
    currency,
    metadata,
    automatic_payment_methods: {
      enabled: true,
    },
  });
};

const retrievePaymentIntent = async (paymentIntentId) => {
  const stripe = getStripeClient();
  return stripe.paymentIntents.retrieve(paymentIntentId);
};

module.exports = {
  createPaymentIntent,
  retrievePaymentIntent,
};
