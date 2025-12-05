import express from "express";
import {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from "../Controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify-email/:token", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);

export default router;
