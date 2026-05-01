import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
  createSession,
  endSession,
  getActiveSessions,
  getMyRecentSessions,
  getSessionById,
  joinSession,
} from "../controllers/sessions.controller.js";

const router = express.Router();

router.post("/", protectRoute, createSession); // Create a new session
router.get("/active", protectRoute, getActiveSessions); // Get all active sessions
router.get("/my-recent", protectRoute, getMyRecentSessions); // Get user's recent sessions history
router.get("/:id", protectRoute, getSessionById); // Get session details by ID
router.post("/:id/join", protectRoute, joinSession); // join button
router.post("/:id/end", protectRoute, endSession); // end session button

export default router;

// basic idea is / will create session button 
// /active will show all active sessions no and  live sessions to join 
// /my-recent will show your recent sessions history and total sessions done
// /:id will show session details by id will use in active sessions and recent sessions
// /:id/join will join the session in active sessions rejoin or join button 
// /:id/end will end the session to end the session
