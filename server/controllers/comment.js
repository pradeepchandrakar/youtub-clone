import { createError } from "../error.js";
import Comment from "../models/Comment.js";
import Video from "../models/Video.js";

// ─────────────────────────────────────────────
// Add a Comment
// ─────────────────────────────────────────────
export const addComment = async (req, res, next) => {
  try {
    const newComment = new Comment({
      ...req.body,
      userId: req.user.id,
    });
    const savedComment = await newComment.save();
    res.status(200).json(savedComment);
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// Delete a Comment
// ─────────────────────────────────────────────
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return next(createError(404, "Comment not found"));

    const video = await Video.findById(comment.videoId);
    const isOwner = req.user.id === comment.userId || req.user.id === video?.userId;

    if (isOwner) {
      await comment.deleteOne();
      res.status(200).json("The comment has been deleted.");
    } else {
      return next(createError(403, "You can delete only your comment!"));
    }
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// Get All Comments on a Video
// ─────────────────────────────────────────────
export const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId }).sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
};
