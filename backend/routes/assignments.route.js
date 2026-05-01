import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
  createAssignment,
  getAssignments,
  getAssignmentById,
  submitAssignment,
  getSubmissions,
  getMySubmission,
} from "../controllers/assignments.controller.js";

const router = express.Router();

router.use(protectRoute);

router.route("/")
  .post(createAssignment)
  .get(getAssignments);

router.route("/:id")
  .get(getAssignmentById);

router.route("/:id/submit")
  .post(submitAssignment);

router.route("/:id/submissions")
  .get(getSubmissions);

router.route("/:id/my-submission")
  .get(getMySubmission);

export default router;
