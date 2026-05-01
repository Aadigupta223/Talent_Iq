import { StreamChat } from "stream-chat";
import { StreamClient } from "@stream-io/node-sdk";
import logger from "../utils/logger.js";
import dotenv from "dotenv";
dotenv.config({
  quiet: true,
});

// STEP: 1. Get Stream API credentials from environment variables
const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

// STEP: 2. Validate them
if (!apiKey || !apiSecret) {
  logger.error("Stream API credentials are missing");
  throw new Error("Stream API credentials are missing");
}

// STEP: 3. Initialize and export Stream client
export const chatClient = StreamChat.getInstance(apiKey, apiSecret); // will be used chat features
export const streamClient = new StreamClient(apiKey, apiSecret); // will be used for video calls

// StreamChat.getInstance creates a singleton server-side chat client.
// This client itself does not generate tokens directly,
// but is later used to create user-specific Stream tokens when needed.
// We use getInstance for chatClient because it should be a single shared instance.
// For streamClient (video/calls), we instantiate StreamClient directly.

logger.info("Stream client initialized successfully");

// STEP: 4. Create upsertStreamUser and deleteStreamUser function

//? upsertStreamUser
// NOTE: upsertUser function to add or update user in Stream
const upsertStreamUser = async (userData) => {
  try {
    await streamClient.upsertUser(userData);
    logger.info("User upserted to Stream successfully", { userId: userData.id });
  } catch (error) {
    logger.error("Failed to upsert user to Stream", {
      userId: userData?.id,
      error,
    });
    throw error; // allow Inngest to retry
  }
};

//? deleteStreamUser
// NOTE: deleteUser function to delete user from Stream

const deleteStreamUser = async (userId) => {
  try {
    await streamClient.deleteUser(userId);
    logger.info("User deleted from Stream successfully", { userId });
  } catch (error) {
    logger.error("Failed to delete user from Stream", { userId, error });
    throw error; // allow Inngest to retry
  }
};

// NOTE: the userData is comming from inngest event handler where we sync user from Clerk to our DB the userData is just a placeholder here for that data it can be anything like newUserData etc

// STEP: 5. Export the functions
export { upsertStreamUser, deleteStreamUser };

