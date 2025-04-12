import express from "express";
import {
  addVideo,
  updateVideo,
  deleteVideo,
  getVideo,
  addView,
  trend,
  random,
  sub,
  getAllTags,
  getByTag,
  search
} from "../controllers/video.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

// @route   POST /videos
// @desc    Upload a new video
// @access  Private
router.post("/", verifyToken, addVideo);

// @route   PUT /videos/:id
// @desc    Update video
// @access  Private
router.put("/:id", verifyToken, updateVideo);

// @route   DELETE /videos/:id
// @desc    Delete a video
// @access  Private
router.delete("/:id", verifyToken, deleteVideo);

// @route   GET /videos/find/:id
// @desc    Get a specific video
// @access  Public
router.get("/find/:id", getVideo);

// @route   PUT /videos/view/:id
// @desc    Increase view count
// @access  Public
router.put("/view/:id", addView);

// @route   GET /videos/trend
// @desc    Get trending videos
// @access  Public
router.get("/trend", trend);

// @route   GET /videos/random
// @desc    Get random videos
// @access  Public
router.get("/random", random);

// @route   GET /videos/sub
// @desc    Get videos from subscribed channels
// @access  Private
router.get("/sub", verifyToken, sub);

// @route   GET /videos/tags/all
// @desc    Get all available tags
// @access  Public
router.get("/tags/all", getAllTags);

// @route   GET /videos/tags?tags=tag1,tag2
// @desc    Get videos by tags
// @access  Public
router.get("/tags", getByTag);

// @route   GET /videos/search?q=query
// @desc    Search videos by title/desc
// @access  Public
router.get("/search", search);

export default router;
