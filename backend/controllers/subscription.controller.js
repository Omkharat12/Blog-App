import Stripe from "stripe";
import Post from "../models/post.model.js";
import Subscription from "../models/subscription.model.js";

import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const getSubscriptionStatus = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const subscription = await Subscription.findOne({ user: userId });
    const postCount = await Post.countDocuments({ userId });

    const now = new Date();

    const isValidSubscription =
      subscription?.isSubscribed === true && subscription.expiresAt > now;

    const postLimit = isValidSubscription ? 1000 : 2;

    res.status(200).json({
      isSubscribed: isValidSubscription,
      plan: isValidSubscription ? subscription.plan : "free",
      postCount,
      limitReached: postCount >= postLimit,
    });
  } catch (error) {
    next(error);
  }
};

export const createCheckoutSession = async (req, res) => {
  try {
    const { email, plan } = req.body;

    const userId = req.user?.id; // Securely get from verified token

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: userId missing" });
    }

    const priceIdMap = {
      base: process.env.STRIPE_BASE_PRICE_ID,
      pro: process.env.STRIPE_PRO_PRICE_ID,
    };

    const priceId = priceIdMap[plan];
    if (!priceId) {
      return res.status(400).json({ message: "Invalid plan selected" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: email,
      metadata: { userId, plan },
      success_url: `${process.env.CLIENT_URL}/dashboard?tab=profile`,
      cancel_url: `${process.env.CLIENT_URL}/subscribe`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create session" });
  }
};

// export const stripeWebhook = async (req, res) => {
//   const sig = req.headers["stripe-signature"];
//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       req.rawBody,
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );
//   } catch (err) {
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   if (event.type === "checkout.session.completed") {
//     const session = event.data.object;
//     const userId = session.metadata.userId;
//     const plan = session.metadata.plan;

//     // Calculate expiration
//     let expiresAt;
//     const now = new Date();

//     if (plan === "base") {
//       expiresAt = new Date(now.setMonth(now.getMonth() + 1));
//     } else if (plan === "pro") {
//       expiresAt = new Date(now.setFullYear(now.getFullYear() + 1));
//     }

//     await Subscription.findOneAndUpdate(
//       { user: userId },
//       {
//         isSubscribed: true,
//         plan,
//         expiresAt,
//         stripeCustomerId: session.customer,
//         subscriptionId: session.subscription,
//       },
//       { upsert: true }
//     );
//   }

//   res.status(200).json({ received: true });
// };
