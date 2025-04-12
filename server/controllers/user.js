import { createError } from "../error.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

// ─────────────────────────────────────────────
// Update User
// ─────────────────────────────────────────────
export const updateUser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      if (req.body.username && req.body.username.length < 3) {
        return next(createError(400, "Username should be at least 3 characters long"));
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      err.message.includes("username")
        ? next(createError(400, "Username already exists"))
        : next(createError(500, "Something went wrong"));
    }
  } else {
    return next(createError(403, "You are not authorized to update this user"));
  }
};

// ─────────────────────────────────────────────
// Delete User
// ─────────────────────────────────────────────
export const deleteUser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been deleted");
    } catch (err) {
      next(err);
    }
  } else {
    return next(createError(403, "You are not authorized to delete this user"));
  }
};

// ─────────────────────────────────────────────
// Get User
// ─────────────────────────────────────────────
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return next(createError(404, "User not found"));
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// Subscribe to User
// ─────────────────────────────────────────────
export const subscribe = async (req, res, next) => {
  try {
    if (req.user.id === req.params.id) {
      return next(createError(400, "You can't subscribe to yourself"));
    }

    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { subscribedUsers: req.params.id },
    });

    await User.findByIdAndUpdate(req.params.id, {
      $inc: { subscribers: 1 },
    });

    res.status(200).json("Subscription successful");
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// Unsubscribe from User
// ─────────────────────────────────────────────
export const unsubscribe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { subscribedUsers: req.params.id },
    });

    await User.findByIdAndUpdate(req.params.id, {
      $inc: { subscribers: -1 },
    });

    res.status(200).json("Unsubscription successful");
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// Like a Video
// ─────────────────────────────────────────────
export const like = async (req, res, next) => {
  try {
    await Video.findByIdAndUpdate(req.params.videoId, {
      $addToSet: { likes: req.user.id },
      $pull: { dislikes: req.user.id },
    });

    res.status(200).json("Video liked");
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// Dislike a Video
// ─────────────────────────────────────────────
export const dislike = async (req, res, next) => {
  try {
    await Video.findByIdAndUpdate(req.params.videoId, {
      $addToSet: { dislikes: req.user.id },
      $pull: { likes: req.user.id },
    });

    res.status(200).json("Video disliked");
  } catch (err) {
    next(err);
  }
};
