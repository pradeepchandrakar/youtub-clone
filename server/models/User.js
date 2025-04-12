import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    minlength: 3,
    maxlength: 16,
    lowercase: true,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    select: false // hides password by default when querying
  },
  img: {
    type: String,
    default: ""
  },
  subscribers: {
    type: Number,
    default: 0
  },
  subscribedUsers: {
    type: [String],
    default: []
  },
  fromGoogle: {
    type: Boolean,
    default: false
  },
  verified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model("User", UserSchema);
