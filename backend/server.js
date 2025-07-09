import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db.js";
import { stripeWebhook } from "./controllers/stripe.controller.js";
import authRoutes from "./routes/auth.route.js";
import commentRoutes from "./routes/comment.route.js";
import postRoutes from "./routes/post.route.js";
import subscriptionRoute from "./routes/subscription.route.js";
import userRoutes from "./routes/user.route.js";
const app = express();

dotenv.config();

app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // React dev server
    credentials: true, // 🔥 MUST be true
  })
);

app.use(express.json());

connectDB();
app.listen(3000, () => {
  console.log("Server Started on 3000");
});

// Stripe needs raw body

app.use("/api/subscribe", subscriptionRoute);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
