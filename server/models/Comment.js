import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    desc: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 1000, // Optional limit to prevent abuse
    },
  },
  { timestamps: true }
);

export default mongoose.model("Comment", CommentSchema);
