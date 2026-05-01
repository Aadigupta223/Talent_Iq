import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router";
import { GraduationCapIcon, ShieldCheckIcon, SparklesIcon, BookOpenIcon, UsersIcon, ZapIcon } from "lucide-react";
import { useSetRole } from "../hooks/useUserDb";
import { useState } from "react";
import toast from "react-hot-toast";

function RoleSelectionPage() {
  const { user } = useUser();
  const setRoleMutation = useSetRole();
  const [selected, setSelected] = useState(null);

  // Auto-detect role hint from email domain
  const email = user?.primaryEmailAddress?.emailAddress || "";
  const isEduEmail = email.endsWith(".edu") || email.endsWith(".edu.in") || email.endsWith(".ac.in");

  const navigate = useNavigate();

  const handleContinue = async () => {
    if (!selected) return;
    try {
      await setRoleMutation.mutateAsync(selected);
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to set role:", err);
      toast.error(err?.response?.data?.message || "Failed to set role. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300 flex flex-col">
      {/* Top Bar */}
      <nav className="bg-base-100/80 backdrop-blur-md border-b border-primary/20 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto p-4 flex items-center gap-3">
          <div className="size-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg">
            <SparklesIcon className="size-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-mono tracking-wider">
              Talent IQ
            </span>
            <span className="text-xs text-base-content/60 font-medium -mt-1">Code Together</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-3xl w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Welcome, {user?.firstName || "there"}!
              </span>
            </h1>
            <p className="text-lg text-base-content/60 max-w-lg mx-auto">
              How would you like to use Talent IQ? Choose your role to get started.
            </p>
            {isEduEmail && (
              <div className="mt-3 badge badge-primary badge-outline gap-2 py-3 px-4">
                <ShieldCheckIcon className="size-4" />
                Educational email detected — Faculty access recommended
              </div>
            )}
          </div>

          {/* Role Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            {/* Teacher / Admin Card */}
            <button
              onClick={() => setSelected("teacher")}
              className={`group relative card bg-base-100 shadow-xl cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl border-2 ${
                selected === "teacher"
                  ? "border-primary ring-4 ring-primary/20"
                  : "border-transparent hover:border-primary/40"
              }`}
            >
              {selected === "teacher" && (
                <div className="absolute -top-3 -right-3 size-8 rounded-full bg-primary flex items-center justify-center shadow-lg z-10">
                  <svg className="size-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
              <div className="card-body items-center text-center py-10">
                <div className="size-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <ShieldCheckIcon className="size-10 text-white" />
                </div>
                <h2 className="card-title text-2xl mb-2">Teacher / Admin</h2>
                <p className="text-base-content/60 mb-4">
                  Create coding sessions, manage assignments, track student progress, and lead collaborative learning.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <span className="badge badge-sm badge-primary/10 gap-1">
                    <ZapIcon className="size-3" /> Create Sessions
                  </span>
                  <span className="badge badge-sm badge-primary/10 gap-1">
                    <BookOpenIcon className="size-3" /> Manage Assignments
                  </span>
                  <span className="badge badge-sm badge-primary/10 gap-1">
                    <UsersIcon className="size-3" /> View Submissions
                  </span>
                </div>
              </div>
            </button>

            {/* Student Card */}
            <button
              onClick={() => setSelected("student")}
              className={`group relative card bg-base-100 shadow-xl cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl border-2 ${
                selected === "student"
                  ? "border-secondary ring-4 ring-secondary/20"
                  : "border-transparent hover:border-secondary/40"
              }`}
            >
              {selected === "student" && (
                <div className="absolute -top-3 -right-3 size-8 rounded-full bg-secondary flex items-center justify-center shadow-lg z-10">
                  <svg className="size-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
              <div className="card-body items-center text-center py-10">
                <div className="size-20 rounded-2xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <GraduationCapIcon className="size-10 text-white" />
                </div>
                <h2 className="card-title text-2xl mb-2">Student</h2>
                <p className="text-base-content/60 mb-4">
                  Join live coding sessions, solve problems, submit assignments, and improve your skills.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <span className="badge badge-sm badge-secondary/10 gap-1">
                    <ZapIcon className="size-3" /> Join Sessions
                  </span>
                  <span className="badge badge-sm badge-secondary/10 gap-1">
                    <BookOpenIcon className="size-3" /> Solve Problems
                  </span>
                  <span className="badge badge-sm badge-secondary/10 gap-1">
                    <UsersIcon className="size-3" /> Submit Code
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Continue Button */}
          <div className="text-center">
            <button
              onClick={handleContinue}
              disabled={!selected || setRoleMutation.isPending}
              className="btn btn-primary btn-lg gap-2 px-12 shadow-xl disabled:opacity-50"
            >
              {setRoleMutation.isPending ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Setting up...
                </>
              ) : (
                <>
                  Continue as {selected === "teacher" ? "Teacher" : selected === "student" ? "Student" : "..."}
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
            <p className="text-sm text-base-content/40 mt-4">
              You can change your role later from the dashboard settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoleSelectionPage;
