import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { chatClient, streamClient } from "../events/stream.js";
import { Session } from "../models/session.model.js";

//? Create a new session
// NOTE: in this fucnction we take problem, difficulty from body and take userid from both db and clerk generate a unique call id for stream video create session in db create stream video call chat messaging send response
const createSession = asyncHandler(async (req, res) => {
  // STEP:1 Get problem, difficulty, and maxParticipants from body and userId from req.user
  const { problem, difficulty, maxParticipants } = req.body;
  const userId = req.user._id;
  const clerkId = req.user.clerkId;

  if (!problem || !difficulty) {
    throw new ApiError(400, "Problem and difficulty are required to create a session");
  }

  // Validate maxParticipants (default 100, min 2, max 200)
  const participantLimit = Math.min(
    200,
    Math.max(2, parseInt(maxParticipants) || 100)
  );

  // STEP:2 generate a unique call id for stream video
  const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  //STEP:3 create session in db
  const session = await Session.create({
    problem,
    difficulty,
    host: userId,
    callId,
    maxParticipants: participantLimit,
  });
  // Session is model from session.model.js means we are creating a new session document in mongodb with problem difficulty host and callid

  //* we used try catch because if stream video call or chat messaging fails we need to rollback the session creation in db

  try {
    //STEP:4 create stream video call
    await streamClient.video.call("default", callId).getOrCreate({
      data: {
        created_by_id: clerkId,
        //  ENABLE RECORDING FOR ALL PARTICIPANTS
        recording: {
          mode: "available",
        },
        // permissions for recording (allow both host and participant to start/stop recording)
        permissions: {
          can_start_recording: ["*"], // everyone can record
          can_stop_recording: ["*"],
        },
        custom: { problem, difficulty, sessionId: session._id.toString() },
      },
    });

    //STEP:5 chat messaging
    const channel = chatClient.channel("messaging", callId, {
      name: `${problem} Session`,
      created_by_id: clerkId,
      members: [clerkId],
    });
    await channel.create();
  } catch (err) {
    await Session.findByIdAndDelete(session._id);
    throw new ApiError(500, "Failed to create session infrastructure");
  }

  // STEP:6 send response
  return res
    .status(201)
    .json(new ApiResponse(201, "Session created successfully", { session, callId }));
});

//? Get active sessions
// NOTE: fetch all sessions from db where isActive
const getActiveSessions = asyncHandler(async (_req, res) => {
  // STEP:1 fetch all sessions from db where isActive  using populate to get host details why we use populate because host is reference to user model so we need to populate it to get user details
  const sessions = await Session.find({ status: "active" })
    .populate("host", "name profileImage email clerkId")
    .populate("participants", "name profileImage email clerkId")
    .sort({ createdAt: -1 }) // Sort by createdAt in descending order
    .limit(20); // Limit to 20 sessions
  return res
    .status(200)
    .json(new ApiResponse(200, "Active sessions fetched successfully", sessions));
});

//? Get user's recent sessions history
// NOTE: fetch sessions from db where user is host or participant and status is completed
const getMyRecentSessions = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // get sessions where user is either host or in participants array
  const sessions = await Session.find({
    status: "completed",
    $or: [{ host: userId }, { participants: userId }],
  })
    .sort({ createdAt: -1 })
    .limit(20);

  return res
    .status(200)
    .json(new ApiResponse(200, "User's recent sessions fetched successfully", sessions));
});

//? Get session details by ID
// NOTE: fetch session from db by id populate host and participants details
const getSessionById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const session = await Session.findById(id)
    .populate("host", "name email profileImage clerkId")
    .populate("participants", "name email profileImage clerkId");

  if (!session) {
    throw new ApiError(404, "Session not found");
  }

  const isHost = session.host._id.toString() === userId.toString();
  const isParticipant = session.participants.some(
    (p) => p._id.toString() === userId.toString()
  );

  // 🔥 RULE:
  // Anyone can VIEW active session
  // Only host/participant can TAKE ACTIONS (join/end/etc.)
  if (session.status !== "active" && !isHost && !isParticipant) {
    throw new ApiError(403, "Access denied");
  }

  res.status(200).json(new ApiResponse(200, "Session details fetched successfully", session));
});

//? Join session
// NOTE: user can join session if session is active and has room for more participants
const joinSession = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  const clerkId = req.user.clerkId;

  // Atomically add participant if:
  // 1. Session is active
  // 2. User is not the host
  // 3. User is not already a participant
  // 4. Participants count < maxParticipants
  const session = await Session.findOneAndUpdate(
    {
      _id: id,
      status: "active",
      host: { $ne: userId },
      participants: { $ne: userId },
      $expr: { $lt: [{ $size: { $ifNull: ["$participants", []] } }, "$maxParticipants"] },
    },
    { $addToSet: { participants: userId } },
    { new: true }
  );

  if (!session) {
    throw new ApiError(
      409,
      "Cannot join session (not active, full, host attempting to join, or already joined)"
    );
  }

  const channel = chatClient.channel("messaging", session.callId);
  await channel.addMembers([clerkId]);
  // why dont we create for video call because video call is created when session is created and both host and participant join the same call using the same callId but why we add member to chat channel because chat channel is created when session is created with only host as member so when participant joins we need to add them to the chat channel

  res.status(200).json(new ApiResponse(200, "Joined session successfully", session));
});

//? End session
// NOTE: host can end session by changing status to completed
const endSession = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const session = await Session.findById(id);
  if (!session) {
    throw new ApiError(404, "Session not found");
  }

  // only host can end
  if (session.host.toString() !== userId.toString()) {
    throw new ApiError(403, "Only the host can end the session");
  }

  if (session.status === "completed") {
    throw new ApiError(400, "Session already completed");
  }

  session.status = "completed";
  await session.save();
  const call = streamClient.video.call("default", session.callId);
  const data = await call.get();
  console.log("RECORDINGS:", data.recordings);

  res.status(200).json(new ApiResponse(200, "Session ended successfully", session));
});

export {
  createSession,
  endSession,
  getActiveSessions,
  getMyRecentSessions,
  getSessionById,
  joinSession,
};
