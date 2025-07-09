import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      // one subscription per user
    },
    isSubscribed: {
      type: Boolean,
      default: false,
    },
    stripeCustomerId: String,
    subscriptionId: String,
    plan: {
      type: String,
      enum: ["free", "base", "pro"],
      default: "free",
    },
    expiresAt: Date,
  },
  { timestamps: true }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;
