import express from "express";
import {
  createComment,
  deleteComment,
  editComment,
  getcomments,
  getPostComments,
  likeComment,
} from "../controllers/comment.controller.js";
import { authorizeRoles } from "../utils/authorizeRoles.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post(
  "/create",
  verifyToken,
  authorizeRoles("admin", "user"),
  createComment
);
router.get(
  "/getPostComments/:postId",
  verifyToken,
  authorizeRoles("admin", "user"),
  getPostComments
);
router.put("/likeComment/:commentId", verifyToken, likeComment);
router.put(
  "/editComment/:commentId",
  verifyToken,
  authorizeRoles("admin", "user"),
  editComment
);
router.delete(
  "/deleteComment/:commentId",
  verifyToken,
  authorizeRoles("admin", "user"),
  deleteComment
);
router.get("/getcomments", verifyToken, authorizeRoles("admin"), getcomments);

export default router;
