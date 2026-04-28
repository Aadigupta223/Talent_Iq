import { requireAuth } from "@clerk/express";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

const protectRoute = [
  requireAuth(), // Clerk middleware to require authentication
  // now we will take the user id from clerk and check in our db
  asyncHandler(async (req, res, next) => {
    // STEP:1 Get user id from Clerk
    const clerkUserId = req.auth?.userId; // - ? because of this You are not assuming this always exists
    if (!clerkUserId) {
      return next(new ApiError(401, "You are not authorized to access this route"));
    }
    // STEP:2 Find user in our database
    const user = await User.findOne({ clerkId: clerkUserId });

    // STEP:3 If user not found, throw an error
    if (!user) {
      return next(new ApiError(401, "user not found in our database"));
    }
    // STEP:4 Attach user to request object
    req.user = user;
    // attach means we are adding a new property to the req object means req.user will now be available in the next middlewares or controllers means you now have access to the user data in the req object you can use in controllers or wherever needed
    next();
  }),
];

export { protectRoute };
