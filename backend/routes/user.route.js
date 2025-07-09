import express from "express";
import {
  deleteUser,
  getUser,
  getUsers,
  signout,
  test,
  updateUser,
} from "../controllers/user.controller.js";
import { authorizeRoles } from "../utils/authorizeRoles.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.put(
  "/update/:userId",
  verifyToken,
  authorizeRoles("admin", "user"),
  updateUser
);
router.delete(
  "/delete/:userId",
  verifyToken,
  authorizeRoles("admin", "user"),
  deleteUser
);
router.post("/signout", signout);
router.get("/getusers", verifyToken, authorizeRoles("admin"), getUsers);
router.get("/:userId", getUser);

export default router;
