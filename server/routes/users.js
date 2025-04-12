import express from "express";
import {
  updateUser,
  deleteUser,
  getUser,
  subscribe,
  unsubscribe,
  like,
  dislike
} from "../controllers/user.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

// @route   PUT /users/:id
// @desc    Update user info
// @access  Private (only the user themselves)
router.put("/:id", verifyToken, updateUser);

// @route   DELETE /users/:id
// @desc    Delete a user
// @access  Private (only the user themselves)
router.delete("/:id", verifyToken, deleteUser);

// @route   GET /users/find/:id
// @desc    Get a user's public info
// @access  Public
router.get("/find/:id", getUser);

// @route   PUT /users/sub/:id
// @desc    Subscribe to another user
// @access  Private
router.put("/sub/:id", verifyToken, subscribe);

// @route   PUT /users/unsub/:id
// @desc    Unsubscribe from a user
// @access  Private
router.put("/unsub/:id", verifyToken, unsubscribe);

// @route   PUT /users/like/:videoId
// @desc    Like a video
// @access  Private
router.put("/like/:videoId", verifyToken, like);

// @route   PUT /users/dislike/:videoId
// @desc    Dislike a video
// @access  Private
router.put("/dislike/:videoId", verifyToken, dislike);

export default router;
