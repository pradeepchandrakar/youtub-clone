import User from "../models/User.js";
import Video from "../models/Video.js";
import { createError } from "../error.js";

// ─────────────────────────────────────────────
// Add Video
// ─────────────────────────────────────────────
export const addVideo = async (req, res, next) => {
  const newVideo = new Video({ userId: req.user.id, ...req.body });
  try {
    const savedVideo = await newVideo.save();
    res.status(200).json(savedVideo);
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// Update Video
// ─────────────────────────────────────────────
export const updateVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, "Video not found"));

    if (video.userId !== req.user.id) {
      return next(createError(403, "You are not authorized to update this video"));
    }

    const updatedVideo = await Video.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updatedVideo);
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// Delete Video
// ─────────────────────────────────────────────
export const deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, "Video not found"));

    if (video.userId !== req.user.id) {
      return next(createError(403, "You are not authorized to delete this video"));
    }

    await Video.findByIdAndDelete(req.params.id);
    res.status(200).json("Video has been deleted");
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// Get a Video
// ─────────────────────────────────────────────
export const getVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, "Video not found"));
    res.status(200).json(video);
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// Add View
// ─────────────────────────────────────────────
export const addView = async (req, res, next) => {
  try {
    await Video.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 }
    });
    res.status(200).json("The view count has been increased");
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// Random Videos
// ─────────────────────────────────────────────
export const random = async (req, res, next) => {
  try {
    const videos = await Video.aggregate([{ $sample: { size: 40 } }]);
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// Trending Videos
// ─────────────────────────────────────────────
export const trend = async (req, res, next) => {
  try {
    const videos = await Video.find().sort({ views: -1 }).limit(40);
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// Subscribed Channels Feed
// ─────────────────────────────────────────────
export const sub = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const subscribedChannels = user.subscribedUsers;

    const videoLists = await Promise.all(
      subscribedChannels.map((channelId) =>
        Video.find({ userId: channelId })
      )
    );

    const flatList = videoLists.flat().sort((a, b) => b.createdAt - a.createdAt);
    res.status(200).json(flatList);
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// Get All Tags
// ─────────────────────────────────────────────
export const getAllTags = async (req, res, next) => {
  try {
    const tags = await Video.distinct("tags");
    tags.unshift("All");
    res.status(200).json(tags);
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// Get Videos by Tag
// ─────────────────────────────────────────────
export const getByTag = async (req, res, next) => {
  const tags = req.query.tags?.split(",") || [];
  try {
    const videos = await Video.find({ tags: { $in: tags } }).limit(20);
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// Search Videos
// ─────────────────────────────────────────────
export const search = async (req, res, next) => {
  const query = req.query.q;
  try {
    const videos = await Video.find({
      title: { $regex: query, $options: "i" }
    }).limit(40);
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};
