import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { chatClient } from "../events/stream.js";
const getStreamToken = asyncHandler(async (req, res) => {
  // STEP:1 Get authenticated user context (mapped from Clerk to internal DB user)
  const streamUserId = req.user.clerkId;
  if (!streamUserId) {
    throw new ApiError(400, "User information is missing");
  }
  // STEP:2 Generate Stream token for the user using createToken method use chatClient from stream.js
  const token = chatClient.createToken(streamUserId);
  // STEP:3 Send the token in response
  return res.status(200).json(
    new ApiResponse(200, "Stream token generated successfully", {
      token,
      userId: req.user.clerkId,
      userName: req.user.name,
      userImage: req.user.image,
    })
    //NOTE: all this res are in fromat of clerk user object
    // use clerkId for Stream (not mongodb _id)=> it should match the id we have in the stream dashboard
  );
});

export { getStreamToken };
