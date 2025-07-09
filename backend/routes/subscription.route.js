import express from "express";
import {
  createCheckoutSession,
  getSubscriptionStatus,
} from "../controllers/subscription.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/status/:userId", verifyToken, getSubscriptionStatus);
router.post("/checkout", verifyToken, createCheckoutSession);

export default router;
