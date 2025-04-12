import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto-js";
import User from "../models/User.js";
import Token from "../models/Emailtoken.js";
import sendEmail from "../utils/sendEmail.js";
import { createError } from "../error.js";

// ─────────────────────────────────────────────
// User Signup with Email Verification
// ─────────────────────────────────────────────
export const signup = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    let newUser = new User({ ...req.body, password: hash });
    newUser = await newUser.save();

    const token = await new Token({
      userId: newUser._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();

    const url = `${process.env.BASE_URL}auth/${newUser._id}/verify/${token.token}`;
    await sendEmail(newUser.email, "Verify Your Email", url);

    res.status(201).send({
      message: "User created successfully. A verification email has been sent to your account.",
    });
  } catch (err) {
    console.log(err);
    const msg = err.message.includes("username")
      ? err.message.includes("shorter")
        ? "Username should be at least 3 characters"
        : "Username already exists"
      : "Email is already taken";
    next(createError(400, msg));
  }
};

// ─────────────────────────────────────────────
// User Signin with Verification Check
// ─────────────────────────────────────────────
export const signin = async (req, res, next) => {
  try {
    const user = await User.findOne(
      req.body.username ? { username: req.body.username } : { email: req.body.email }
    );
    if (!user) return next(createError(404, "User not found"));

    const isCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isCorrect) return next(createError(400, "Wrong credentials"));

    // If user is not verified
    if (!user.verified) {
      let token = await Token.findOne({ userId: user._id });
      if (!token) {
        token = await new Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();
      }
      const url = `${process.env.BASE_URL}auth/${user._id}/verify/${token.token}`;
      await sendEmail(user.email, "Verify Your Email", url);
      return res.status(400).send({ message: "Verification email resent. Please check your inbox." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const { password, ...userData } = user._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      })
      .status(200)
      .json(userData);
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// User Signout
// ─────────────────────────────────────────────
export const signout = (req, res, next) => {
  try {
    res.clearCookie("access_token", { path: "/" });
    res.status(200).send("User signed out successfully");
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// Google Authentication
// ─────────────────────────────────────────────
export const googleAuth = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      return res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(user._doc);
    }

    const newUser = new User({
      ...req.body,
      fromGoogle: true,
      verified: true, // ✅ Automatically verified
    });

    const savedUser = await newUser.save();
    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET);

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(savedUser._doc);
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// Verify Email Token
// ─────────────────────────────────────────────
export const verifytoken = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(400).send({ message: "User not found" });

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });

    if (!token) return res.status(400).send({ message: "Invalid or expired link" });

    user.verified = true;
    await user.save();
    await token.deleteOne();

    res.status(200).send({ message: "Email verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal server error while verifying email" });
  }
};
