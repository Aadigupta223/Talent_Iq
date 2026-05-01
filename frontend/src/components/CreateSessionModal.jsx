import { Code2Icon, LoaderIcon, PlusIcon, UsersIcon } from "lucide-react";
import { PROBLEMS } from "../data/problems";

function CreateSessionModal({
  isOpen,
  onClose,
  roomConfig,
  setRoomConfig,
  onCreateRoom,
  isCreating,
}) {
  const problems = Object.values(PROBLEMS);

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-2xl mb-6">Create New Session</h3>

        <div className="space-y-8">
          {/* PROBLEM SELECTION */}
          <div className="space-y-2">
            <label className="label">
              <span className="label-text font-semibold">Select Problem</span>
              <span className="label-text-alt text-error">*</span>
            </label>

            <select
              className="select w-full"
              value={roomConfig.problem}
              onChange={(e) => {
                const selectedProblem = problems.find((p) => p.title === e.target.value);
                setRoomConfig((prev) => ({
                  ...prev,
                  difficulty: selectedProblem.difficulty,
                  problem: e.target.value,
                }));
              }}
            >
              <option value="" disabled>
                Choose a coding problem...
              </option>

              {problems.map((problem) => (
                <option key={problem.id} value={problem.title}>
                  {problem.title} ({problem.difficulty})
                </option>
              ))}
            </select>
          </div>

          {/* MAX PARTICIPANTS */}
          <div className="space-y-2">
            <label className="label">
              <span className="label-text font-semibold">Max Participants</span>
              <span className="label-text-alt opacity-60">2 – 200</span>
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="2"
                max="200"
                value={roomConfig.maxParticipants || 100}
                onChange={(e) =>
                  setRoomConfig((prev) => ({
                    ...prev,
                    maxParticipants: parseInt(e.target.value),
                  }))
                }
                className="range range-primary flex-1"
              />
              <div className="flex items-center gap-2 bg-base-200 px-4 py-2 rounded-lg min-w-[80px] justify-center">
                <UsersIcon className="size-4 text-primary" />
                <span className="font-bold text-lg">{roomConfig.maxParticipants || 100}</span>
              </div>
            </div>
          </div>

          {/* ROOM SUMMARY */}
          {roomConfig.problem && (
            <div className="alert alert-success">
              <Code2Icon className="size-5" />
              <div>
                <p className="font-semibold">Room Summary:</p>
                <p>
                  Problem: <span className="font-medium">{roomConfig.problem}</span>
                </p>
                <p>
                  Max Participants:{" "}
                  <span className="font-medium">
                    {roomConfig.maxParticipants || 100} users
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>

          <button
            className="btn btn-primary gap-2"
            onClick={onCreateRoom}
            disabled={isCreating || !roomConfig.problem}
          >
            {isCreating ? (
              <LoaderIcon className="size-5 animate-spin" />
            ) : (
              <PlusIcon className="size-5" />
            )}

            {isCreating ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}
export default CreateSessionModal;