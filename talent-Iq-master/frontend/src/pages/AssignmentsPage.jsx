import { useState } from "react";
import { useUserDb } from "../hooks/useUserDb";
import { useAssignments, useCreateAssignment } from "../hooks/useAssignments";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import { BookOpenIcon, PlusIcon, CalendarIcon, UserIcon, EditIcon } from "lucide-react";
import { PROBLEMS } from "../data/problems";

function AssignmentsPage() {
  const navigate = useNavigate();
  const { data: userDb, isLoading: loadingUser } = useUserDb();
  const { data: assignments = [], isLoading: loadingAssignments } = useAssignments();
  const createAssignmentMutation = useCreateAssignment();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    problemId: "",
    dueDate: "",
  });

  const isTeacher = userDb?.role === "teacher";

  const handleCreate = (e) => {
    e.preventDefault();
    createAssignmentMutation.mutate(formData, {
      onSuccess: () => {
        setShowCreateModal(false);
        setFormData({ title: "", description: "", problemId: "", dueDate: "" });
      },
    });
  };

  return (
    <div className="min-h-screen bg-base-300">
      <Navbar />
      <div className="container mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BookOpenIcon className="w-8 h-8 text-primary" />
            {isTeacher ? "Manage Assignments" : "My Assignments"}
          </h1>
          {isTeacher && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary gap-2"
            >
              <PlusIcon className="w-5 h-5" /> Create Assignment
            </button>
          )}
        </div>

        {(loadingUser || loadingAssignments) ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : assignments.length === 0 ? (
          <div className="text-center py-20 bg-base-100 rounded-2xl shadow-sm border border-base-200">
            <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpenIcon className="w-8 h-8 text-base-content/50" />
            </div>
            <h2 className="text-xl font-bold mb-2">No assignments yet</h2>
            <p className="text-base-content/60">
              {isTeacher ? "Create your first assignment to get started." : "Check back later for new assignments."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((assignment) => (
              <div key={assignment._id} className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-shadow">
                <div className="card-body">
                  <h2 className="card-title text-xl">{assignment.title}</h2>
                  <p className="text-base-content/70 line-clamp-2">{assignment.description}</p>
                  
                  <div className="flex flex-col gap-2 mt-4 text-sm text-base-content/60">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                    </div>
                    {!isTeacher && (
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4" />
                        <span>Teacher: {assignment.teacher?.name}</span>
                      </div>
                    )}
                  </div>

                  <div className="card-actions justify-end mt-4">
                    <button
                      onClick={() => navigate(`/assignments/${assignment._id}`)}
                      className={`btn ${isTeacher ? 'btn-secondary' : 'btn-primary'} btn-sm`}
                    >
                      {isTeacher ? "View Submissions" : "Solve Assignment"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Assignment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-base-100 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-base-200">
              <h2 className="text-2xl font-bold">Create Assignment</h2>
            </div>
            
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Title</span></label>
                <input required type="text" className="input input-bordered" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              
              <div className="form-control">
                <label className="label"><span className="label-text">Description</span></label>
                <textarea required className="textarea textarea-bordered h-24" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Select Problem</span></label>
                <select required className="select select-bordered" value={formData.problemId} onChange={e => setFormData({...formData, problemId: e.target.value})}>
                  <option value="" disabled>Select a problem</option>
                  {Object.values(PROBLEMS).map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Due Date</span></label>
                <input required type="datetime-local" className="input input-bordered" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
              </div>

              <div className="mt-6 flex gap-3 justify-end">
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={createAssignmentMutation.isLoading}>
                  {createAssignmentMutation.isLoading ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AssignmentsPage;
