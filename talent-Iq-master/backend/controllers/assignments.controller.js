import { Assignment } from "../models/assignment.model.js";
import { Submission } from "../models/submission.model.js";
import { Notification } from "../models/notification.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

// @desc    Create new assignment
// @route   POST /api/assignments
// @access  Private (Teacher only)
export const createAssignment = asyncHandler(async (req, res) => {
  if (req.user.role !== "teacher") {
    throw new ApiError(403, "Only teachers can create assignments");
  }

  const { title, description, problemId, dueDate } = req.body;

  if (!title || !description || !problemId || !dueDate) {
    throw new ApiError(400, "All fields are required");
  }

  const assignment = await Assignment.create({
    title,
    description,
    problemId,
    dueDate,
    teacher: req.user._id,
  });

  // Notify all students
  const students = await User.find({ role: "student" });
  const notifications = students.map((student) => ({
    recipient: student._id,
    type: "assignment_created",
    title: "New Assignment",
    message: `A new assignment "${title}" has been posted by ${req.user.name}.`,
    link: `/assignments/${assignment._id}`,
  }));
  
  if (notifications.length > 0) {
    await Notification.insertMany(notifications);
  }

  res.status(201).json(new ApiResponse(201, "Assignment created successfully", assignment));
});

// @desc    Get assignments
// @route   GET /api/assignments
// @access  Private
export const getAssignments = asyncHandler(async (req, res) => {
  let query = {};
  
  if (req.user.role === "teacher") {
    query.teacher = req.user._id;
  } else {
    query.isActive = true;
  }

  const assignments = await Assignment.find(query)
    .populate("teacher", "name profileImage")
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, "Assignments retrieved successfully", assignments));
});

// @desc    Get assignment by ID
// @route   GET /api/assignments/:id
// @access  Private
export const getAssignmentById = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findById(req.params.id)
    .populate("teacher", "name profileImage");

  if (!assignment) {
    throw new ApiError(404, "Assignment not found");
  }

  res.status(200).json(new ApiResponse(200, "Assignment retrieved successfully", assignment));
});

// @desc    Submit assignment
// @route   POST /api/assignments/:id/submit
// @access  Private (Student only)
export const submitAssignment = asyncHandler(async (req, res) => {
  if (req.user.role !== "student") {
    throw new ApiError(403, "Only students can submit assignments");
  }

  const { code, language } = req.body;
  const assignmentId = req.params.id;

  if (!code || !language) {
    throw new ApiError(400, "Code and language are required");
  }

  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) {
    throw new ApiError(404, "Assignment not found");
  }

  // Check if already submitted
  const existingSubmission = await Submission.findOne({
    assignment: assignmentId,
    student: req.user._id,
  });

  if (existingSubmission) {
    throw new ApiError(400, "You have already submitted this assignment");
  }

  const isLate = new Date() > new Date(assignment.dueDate);

  const submission = await Submission.create({
    assignment: assignmentId,
    student: req.user._id,
    code,
    language,
    isLate,
  });

  // Notify the teacher
  await Notification.create({
    recipient: assignment.teacher,
    type: "assignment_submitted",
    title: "New Submission",
    message: `${req.user.name} has submitted "${assignment.title}".`,
    link: `/assignments/${assignment._id}`,
  });

  res.status(201).json(new ApiResponse(201, "Assignment submitted successfully", submission));
});

// @desc    Get all submissions for an assignment
// @route   GET /api/assignments/:id/submissions
// @access  Private (Teacher only)
export const getSubmissions = asyncHandler(async (req, res) => {
  if (req.user.role !== "teacher") {
    throw new ApiError(403, "Only teachers can view submissions");
  }

  const assignment = await Assignment.findById(req.params.id);
  if (!assignment) {
    throw new ApiError(404, "Assignment not found");
  }

  if (assignment.teacher.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only view submissions for your own assignments");
  }

  const submissions = await Submission.find({ assignment: req.params.id })
    .populate("student", "name email profileImage")
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, "Submissions retrieved successfully", submissions));
});

// @desc    Get my submission for an assignment
// @route   GET /api/assignments/:id/my-submission
// @access  Private (Student only)
export const getMySubmission = asyncHandler(async (req, res) => {
  const submission = await Submission.findOne({
    assignment: req.params.id,
    student: req.user._id,
  });

  if (!submission) {
    return res.status(200).json(new ApiResponse(200, null, "No submission found"));
  }

  res.status(200).json(new ApiResponse(200, "Submission retrieved successfully", submission));
});
