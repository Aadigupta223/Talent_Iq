import { useUser } from "@clerk/clerk-react";
import { ArrowRightIcon, SparklesIcon, ZapIcon, LinkIcon, BookOpenIcon, EditIcon } from "lucide-react";
import { useState } from "react";
import { useUserDb, useSetRole } from "../hooks/useUserDb";
import { useNavigate } from "react-router";

function WelcomeSection({ onCreateSession }) {
  const { user } = useUser();
  const navigate = useNavigate();
  const { data: userDb, isLoading } = useUserDb();
  const setRoleMutation = useSetRole();
  const [sessionCode, setSessionCode] = useState("");

  const handleToggleRole = () => {
    const newRole = userDb?.role === "teacher" ? "student" : "teacher";
    setRoleMutation.mutate(newRole);
  };

  const handleJoinSession = () => {
    if (sessionCode.trim()) {
      navigate(`/session/${sessionCode.trim()}`);
    }
  };

  return (
    <div className="relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Welcome back, {user?.firstName || "there"}!
              </h1>
            </div>
            <p className="text-xl text-base-content/60 ml-16 flex items-center gap-4">
              Ready to level up your coding skills?
              {!isLoading && userDb && (
                <span className="badge badge-outline badge-lg uppercase flex items-center gap-2 cursor-pointer hover:bg-base-200" onClick={handleToggleRole} title="Click to toggle role for testing">
                  {userDb.role || "student"}
                </span>
              )}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {userDb?.role === "teacher" ? (
              <>
                <button
                  onClick={onCreateSession}
                  className="group px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-2xl transition-all duration-200 hover:opacity-90 flex items-center gap-3 text-white font-bold text-lg w-full justify-center"
                >
                  <ZapIcon className="w-6 h-6" />
                  <span>Create Session</span>
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate("/assignments")}
                  className="group px-8 py-4 bg-base-200 rounded-2xl transition-all duration-200 hover:bg-base-300 flex items-center gap-3 font-bold text-lg w-full justify-center"
                >
                  <EditIcon className="w-6 h-6" />
                  <span>Manage Assignments</span>
                </button>
              </>
            ) : (
              <>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Enter Session Link / ID" 
                    className="input input-bordered w-full h-14 rounded-2xl bg-base-100"
                    value={sessionCode}
                    onChange={(e) => setSessionCode(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleJoinSession()}
                  />
                  <button
                    onClick={handleJoinSession}
                    className="group px-6 py-4 bg-gradient-to-r from-primary to-secondary rounded-2xl transition-all duration-200 hover:opacity-90 flex items-center gap-2 text-white font-bold whitespace-nowrap"
                  >
                    <LinkIcon className="w-5 h-5" />
                    <span>Join</span>
                  </button>
                </div>
                <button
                  onClick={() => navigate("/assignments")}
                  className="group px-8 py-4 bg-base-200 rounded-2xl transition-all duration-200 hover:bg-base-300 flex items-center gap-3 font-bold text-lg w-full justify-center"
                >
                  <BookOpenIcon className="w-6 h-6" />
                  <span>My Assignments</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeSection;``