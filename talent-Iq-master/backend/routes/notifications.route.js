import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "../controllers/notifications.controller.js";

const router = express.Router();

router.use(protectRoute);

router.route("/").get(getNotifications);
router.route("/read-all").put(markAllAsRead);
router.route("/:id/read").put(markAsRead);

export default router;
