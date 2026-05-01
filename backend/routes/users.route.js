import express from "express";
import { getMe, setRole } from "../controllers/users.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protectRoute); // All user routes require auth

router.get("/me", getMe);
router.post("/role", setRole);

export default router;
