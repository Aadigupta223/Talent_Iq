// STEP:1 Import mongoose
import mongoose from "mongoose";
// STEP:2 Create user schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profileImage: {
      type: String,
      required: false,
    },
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["teacher", "student"],
    },
  },
  {
    timestamps: true,
  }
);
// STEP:3 Create and export user model
export const User = mongoose.model("User", userSchema);
