import express from "express";
import {
  create,
  deletepost,
  getposts,
  updatepost,
} from "../controllers/post.controller.js";
import { authorizeRoles } from "../utils/authorizeRoles.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// Only 'user' and 'admin' can create posts
router.post("/create", verifyToken, authorizeRoles("user","admin"), create);

// All roles including public can view posts (optional)
router.get("/getposts", getposts); // No token required or make it token optional

// Only the post owner (user) or admin can delete/update
router.delete(
  "/deletepost/:postId/:userId",
  verifyToken,
  authorizeRoles("user", "admin"),
  deletepost
);
router.put(
  "/updatepost/:postId/:userId",
  verifyToken,
  authorizeRoles("user", "admin"),
  updatepost
);

export default router;
