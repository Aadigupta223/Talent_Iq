import { useNavigate } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import {
  useActiveSessions,
  useCreateSession,
  useMyRecentSessions,
} from "../hooks/useSessions";
import { useUserDb, useSetRole } from "../hooks/useUserDb";

import Navbar from "../components/Navbar";
import WelcomeSection from "../components/WelcomeSection";
import StatsCards from "../components/StatsCards";
import ActiveSessions from "../components/ActiveSessions";
import RecentSessions from "../components/RecentSessions";
import CreateSessionModal from "../components/CreateSessionModal";
import { GraduationCapIcon, ShieldCheckIcon } from "lucide-react";
import toast from "react-hot-toast";

// Inline role-selection modal shown when the user has no role yet
function RolePickerModal({ onRoleSet }) {
  const [selected, setSelected] = useState(null);
  const setRoleMutation = useSetRole();

  const handleConfirm = async () => {
    if (!selected) return;
    try {
      await setRoleMutation.mutateAsync(selected);
      onRoleSet();
    } catch (error) {
      console.error("Role setting failed:", error);
      toast.error(error?.response?.data?.message || "Failed to set role. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-base-100 rounded-3xl shadow-2xl p-10 max-w-lg w-full mx-4 text-center">
        <h2 className="text-3xl font-black mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Choose Your Role
        </h2>
        <p className="text-base-content/60 mb-8">How would you like to use Talent IQ?</p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setSelected("teacher")}
            className={`card bg-base-200 cursor-pointer transition-all duration-200 border-2 p-6 hover:scale-105 ${
              selected === "teacher" ? "border-primary ring-4 ring-primary/20" : "border-transparent"
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="size-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <ShieldCheckIcon className="size-7 text-white" />
              </div>
              <span className="font-bold text-lg">Teacher</span>
              <span className="text-xs text-base-content/50">Create sessions & assignments</span>
            </div>
          </button>

          <button
            onClick={() => setSelected("student")}
            className={`card bg-base-200 cursor-pointer transition-all duration-200 border-2 p-6 hover:scale-105 ${
              selected === "student" ? "border-secondary ring-4 ring-secondary/20" : "border-transparent"
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="size-14 rounded-2xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                <GraduationCapIcon className="size-7 text-white" />
              </div>
              <span className="font-bold text-lg">Student</span>
              <span className="text-xs text-base-content/50">Join sessions & submit code</span>
            </div>
          </button>
        </div>

        <button
          onClick={handleConfirm}
          disabled={!selected || setRoleMutation.isPending}
          className="btn btn-primary btn-lg w-full"
        >
          {setRoleMutation.isPending ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            `Continue as ${selected === "teacher" ? "Teacher" : selected === "student" ? "Student" : "..."}`
          )}
        </button>
      </div>
    </div>
  );
}

function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { data: userDb, isLoading: loadingUser, refetch: refetchUser } = useUserDb();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomConfig, setRoomConfig] = useState({
    problem: "",
    difficulty: "",
    maxParticipants: 100,
  });

  const createSessionMutation = useCreateSession();

  const {
    data: activeSessionsData,
    isLoading: loadingActiveSessions,
  } = useActiveSessions();
  const activeSessions = Array.isArray(activeSessionsData) ? activeSessionsData : [];

  const {
    data: recentSessionsData,
    isLoading: loadingRecentSessions,
  } = useMyRecentSessions();
  const recentSessions = Array.isArray(recentSessionsData) ? recentSessionsData : [];

  const handleCreateRoom = () => {
    if (!roomConfig.problem || !roomConfig.difficulty) return;

    createSessionMutation.mutate(
      {
        problem: roomConfig.problem,
        difficulty: roomConfig.difficulty.toLowerCase(),
        maxParticipants: roomConfig.maxParticipants || 100,
      },
      {
        onSuccess: (data) => {
          setShowCreateModal(false);
          navigate(`/session/${data.session._id}`);
        },
      }
    );
  };

  const isUserInSession = (session) => {
    if (!user?.id) return false;
    return (
      session.host?.clerkId === user.id ||
      session.participants?.some((p) => p.clerkId === user.id)
    );
  };

  // Show the role picker modal if user has loaded and has no role
  const showRolePicker = !loadingUser && userDb && !userDb.role;

  return (
    <>
      <div className="min-h-screen bg-base-300">
        <Navbar />
        <WelcomeSection onCreateSession={() => setShowCreateModal(true)} />

        <div className="container mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <StatsCards
              activeSessionsCount={activeSessions.length}
              recentSessionsCount={recentSessions.length}
            />

            <ActiveSessions
              sessions={activeSessions}
              isLoading={loadingActiveSessions}
              isUserInSession={isUserInSession}
            />
          </div>

          <RecentSessions
            sessions={recentSessions}
            isLoading={loadingRecentSessions}
          />
        </div>
      </div>

      <CreateSessionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        roomConfig={roomConfig}
        setRoomConfig={setRoomConfig}
        onCreateRoom={handleCreateRoom}
        isCreating={createSessionMutation.isPending}
      />

      {/* Role picker modal — shown on first login before role is selected */}
      {showRolePicker && (
        <RolePickerModal onRoleSet={() => refetchUser()} />
      )}
    </>
  );
}

export default DashboardPage;
