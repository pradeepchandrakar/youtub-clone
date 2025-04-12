import express from "express";
import {
  addComment,
  deleteComment,
  getComments
} from "../controllers/comment.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

// @route   POST /comments
// @desc    Add a comment to a video
// @access  Private (requires JWT)
router.post("/", verifyToken, addComment);

// @route   DELETE /comments/:id
// @desc    Delete a specific comment by ID
// @access  Private (only comment owner can delete)
router.delete("/:id", verifyToken, deleteComment);

// @route   GET /comments/:videoId
// @desc    Get all comments for a specific video
// @access  Public
router.get("/:videoId", getComments);

export default router;
