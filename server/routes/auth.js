import express from "express";
import {
  signup,
  signin,
  signout,
  verifytoken,
  googleAuth
} from "../controllers/auth.js";

const router = express.Router();

// @route   POST /auth/signup
// @desc    Create a new user
router.post("/signup", signup);

// @route   POST /auth/signin
// @desc    Sign in user with email & password
router.post("/signin", signin);

// @route   GET /auth/:id/verify/:token
// @desc    Verify email with token
router.get("/:id/verify/:token", verifytoken);

// @route   GET /auth/signout
// @desc    Sign out user (optional - token based logic if any)
router.get("/signout", signout);

// @route   POST /auth/google
// @desc    Authenticate or register using Google
router.post("/google", googleAuth);

export default router;
