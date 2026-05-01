import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, "User data retrieved successfully", req.user));
});

// @desc    Set user role
// @route   POST /api/users/role
// @access  Private
export const setRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  
  if (!role || !["teacher", "student"].includes(role)) {
    throw new ApiError(400, "Invalid role. Must be 'teacher' or 'student'");
  }

  // We only allow setting the role once if we want to be strict, but for MVP let's just update it
  req.user.role = role;
  await req.user.save();

  try {
    const { upsertStreamUser } = await import("../events/stream.js");
    await upsertStreamUser({
      id: req.user.clerkId,
      name: req.user.name,
      email: req.user.email,
      image: req.user.profileImage,
    });
  } catch (error) {
    console.error("Failed to sync user to stream on role change", error);
  }

  res.status(200).json(new ApiResponse(200, "Role updated successfully", req.user));
});
