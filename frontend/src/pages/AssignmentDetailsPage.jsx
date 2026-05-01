import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useUserDb } from "../hooks/useUserDb";
import { useAssignmentById, useAssignmentSubmissions, useMySubmission, useSubmitAssignment } from "../hooks/useAssignments";
import { PROBLEMS } from "../data/problems";
import { executeCode } from "../lib/piston";
import Navbar from "../components/Navbar";
import ProblemDescription from "../components/ProblemDescription";
import CodeEditorPanel from "../components/CodeEditorPanel";
import OutputPanel from "../components/OutputPanel";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { ArrowLeftIcon, PlayIcon, CheckIcon, Loader2Icon, EyeIcon } from "lucide-react";

function AssignmentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: userDb } = useUserDb();
  
  const { data: assignment, isLoading: loadingAssignment } = useAssignmentById(id);
  
  // Teacher data
  const { data: submissions = [] } = useAssignmentSubmissions(id);
  
  // Student data
  const { data: mySubmission } = useMySubmission(id);
  const submitMutation = useSubmitAssignment();

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  
  // Teacher code view modal
  const [viewSubmission, setViewSubmission] = useState(null);

  const problemData = assignment ? Object.values(PROBLEMS).find(p => p.id === assignment.problemId) : null;
  const isTeacher = userDb?.role === "teacher";

  useEffect(() => {
    if (mySubmission) {
      setCode(mySubmission.code);
      setSelectedLanguage(mySubmission.language);
    } else if (problemData?.starterCode?.[selectedLanguage] && !code) {
      setCode(problemData.starterCode[selectedLanguage]);
    }
  }, [problemData, selectedLanguage, mySubmission]);

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);
    const result = await executeCode(selectedLanguage, code);
    setOutput(result);
    setIsRunning(false);
  };

  const handleSubmit = () => {
    if (!confirm("Are you sure you want to submit? You cannot change your code after submission.")) return;
    submitMutation.mutate({ id, code, language: selectedLanguage });
  };

  if (loadingAssignment || !problemData) {
    return (
      <div className="min-h-screen bg-base-300 flex items-center justify-center">
        <Loader2Icon className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  // Teacher View: Submissions List
  if (isTeacher) {
    return (
      <div className="min-h-screen bg-base-300">
        <Navbar />
        <div className="container mx-auto px-6 py-10">
          <button onClick={() => navigate("/assignments")} className="btn btn-ghost mb-4 gap-2">
            <ArrowLeftIcon className="w-4 h-4" /> Back
          </button>
          
          <div className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-200 mb-8">
            <h1 className="text-3xl font-bold mb-2">{assignment.title}</h1>
            <p className="text-base-content/70">{assignment.description}</p>
            <div className="mt-4 text-sm text-base-content/50">
              Due: {new Date(assignment.dueDate).toLocaleString()}
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-4">Submissions ({submissions.length})</h2>
          
          <div className="overflow-x-auto bg-base-100 rounded-2xl shadow-sm border border-base-200">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Submitted At</th>
                  <th>Status</th>
                  <th>Language</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {submissions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-base-content/50">No submissions yet.</td>
                  </tr>
                ) : (
                  submissions.map(sub => (
                    <tr key={sub._id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="w-8 h-8 rounded-full">
                              <img src={sub.student?.profileImage || `https://ui-avatars.com/api/?name=${sub.student?.name}`} alt="" />
                            </div>
                          </div>
                          <span className="font-medium">{sub.student?.name}</span>
                        </div>
                      </td>
                      <td>{new Date(sub.createdAt).toLocaleString()}</td>
                      <td>
                        {sub.isLate ? (
                          <span className="badge badge-error">Late</span>
                        ) : (
                          <span className="badge badge-success">On Time</span>
                        )}
                      </td>
                      <td className="capitalize">{sub.language}</td>
                      <td>
                        <button onClick={() => setViewSubmission(sub)} className="btn btn-sm btn-ghost gap-2">
                          <EyeIcon className="w-4 h-4" /> View Code
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {viewSubmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-base-100 rounded-2xl shadow-xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden">
              <div className="p-4 border-b border-base-200 flex justify-between items-center bg-base-200">
                <h3 className="font-bold text-lg">{viewSubmission.student?.name}'s Code ({viewSubmission.language})</h3>
                <button onClick={() => setViewSubmission(null)} className="btn btn-sm btn-circle">✕</button>
              </div>
              <div className="flex-1 overflow-auto bg-[#1e1e1e] p-4 text-sm font-mono text-white">
                <pre><code>{viewSubmission.code}</code></pre>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Student View: Solve Workspace
  return (
    <div className="h-screen bg-base-100 flex flex-col">
      <Navbar />
      
      <div className="px-6 py-3 border-b border-base-300 bg-base-100 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/assignments")} className="btn btn-ghost btn-sm gap-2">
            <ArrowLeftIcon className="w-4 h-4" /> Back
          </button>
          <div>
            <h1 className="text-xl font-bold">{assignment.title}</h1>
            <p className="text-xs text-base-content/50">Due: {new Date(assignment.dueDate).toLocaleString()}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          {!mySubmission && (
            <>
              <button onClick={handleRunCode} disabled={isRunning} className="btn btn-secondary btn-sm gap-2">
                {isRunning ? <Loader2Icon className="w-4 h-4 animate-spin" /> : <PlayIcon className="w-4 h-4" />}
                Run Code
              </button>
              <button onClick={handleSubmit} disabled={submitMutation.isLoading} className="btn btn-primary btn-sm gap-2">
                {submitMutation.isLoading ? <Loader2Icon className="w-4 h-4 animate-spin" /> : <CheckIcon className="w-4 h-4" />}
                Submit Assignment
              </button>
            </>
          )}
          {mySubmission && (
            <div className="badge badge-success gap-2 p-3">
              <CheckIcon className="w-4 h-4" /> Submitted
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal">
          <Panel defaultSize={40} minSize={30}>
            <div className="h-full overflow-y-auto">
              <ProblemDescription problem={problemData} />
            </div>
          </Panel>
          
          <PanelResizeHandle className="w-2 bg-base-300 cursor-col-resize hover:bg-primary/50 transition-colors" />
          
          <Panel defaultSize={60}>
            <PanelGroup direction="vertical">
              <Panel defaultSize={60}>
                <CodeEditorPanel 
                  code={code} 
                  onCodeChange={setCode} 
                  selectedLanguage={selectedLanguage} 
                  onLanguageChange={(e) => setSelectedLanguage(e.target.value)}
                  readOnly={!!mySubmission} 
                  onRunCode={handleRunCode}
                  isRunning={isRunning}
                />
              </Panel>
              
              <PanelResizeHandle className="h-2 bg-base-300 cursor-row-resize hover:bg-primary/50 transition-colors" />
              
              <Panel defaultSize={40}>
                <OutputPanel output={output} isRunning={isRunning} />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

export default AssignmentDetailsPage;
