import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Better for referencing User model
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 150,
  },
  desc: {
    type: String,
    required: true,
    trim: true,
  },
  imgUrl: {
    type: String,
    required: true,
    trim: true,
  },
  videoUrl: {
    type: String,
    required: true,
    trim: true,
  },
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  tags: {
    type: [String],
    default: [],
    validate: [arrayLimit, '{PATH} exceeds the limit of 10']
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },
  dislikes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },
}, { timestamps: true });

function arrayLimit(val) {
  return val.length <= 10;
}

export default mongoose.model("Video", VideoSchema);
