import dotenv from "dotenv";
import Stripe from "stripe";
import Subscription from "../models/subscription.model.js";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Only handle successful checkout session
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    const plan = session.metadata.plan;

    try {
      // Calculate expiration based on plan
      const now = new Date();
      let expiresAt;

      if (plan === "base") {
        expiresAt = new Date(now.setMonth(now.getMonth() + 1));
      } else if (plan === "pro") {
        expiresAt = new Date(now.setFullYear(now.getFullYear() + 1));
      } else {
        console.warn("⚠️ Unknown plan:", plan);
        return res.status(400).json({ message: "Invalid plan in metadata" });
      }

      // Save or update subscription in MongoDB
      await Subscription.findOneAndUpdate(
        { user: userId },
        {
          isSubscribed: true,
          plan,
          expiresAt,
          stripeCustomerId: session.customer,
          subscriptionId: session.subscription,
        },
        { upsert: true, new: true }
      );

      console.log("✅ Subscription stored for user:", userId);
      res.status(200).json({ received: true });
    } catch (dbErr) {
      console.error("❌ Database error:", dbErr);
      return res.status(500).json({ message: "Database error" });
    }
  } else {
    res.status(200).json({ received: true }); // for other events
  }
};
