import { Router } from "express";
import { getStreamToken } from "../controllers/chat.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/token", protectRoute, getStreamToken);

export default router;
