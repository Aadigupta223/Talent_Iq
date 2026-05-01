import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import {
  useEndSession,
  useJoinSession,
  useSessionById,
} from "../hooks/useSessions.js";

import { PROBLEMS } from "../data/problems.js";
import { executeCode } from "../lib/piston.js";

import Navbar from "../components/Navbar";
import ProblemDescription from "../components/ProblemDescription";
import CodeEditorPanel from "../components/CodeEditorPanel";
import OutputPanel from "../components/OutputPanel";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { getDifficultyBadgeClass } from "../lib/utils.js";

import { Loader2Icon, LogOutIcon, PhoneOffIcon, CopyIcon, CheckIcon } from "lucide-react";
import toast from "react-hot-toast";

import useStreamClient from "../hooks/useStreamClient";
import { StreamCall, StreamVideo } from "@stream-io/video-react-sdk";
import VideoCallUI from "../components/VideoCallUI.jsx";

function SessionPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const { data: session, isLoading: loadingSession, refetch } =
    useSessionById(id);

  const joinSessionMutation = useJoinSession();
  const endSessionMutation = useEndSession();

  const isHost = session?.host?.clerkId === user?.id;
  const isParticipant = session?.participants?.some((p) => p.clerkId === user?.id);

  const {
    call,
    channel,
    chatClient,
    isInitializingCall,
    streamClient,
  } = useStreamClient(session, loadingSession, isHost, isParticipant);

  // ---------- SAFE PROBLEM MAPPING ----------
  const problemData = session?.problem
    ? Object.values(PROBLEMS).find((p) => p.title === session.problem)
    : null;

  useEffect(() => {
    if (problemData?.starterCode?.[selectedLanguage]) {
      setCode(problemData.starterCode[selectedLanguage]);
    }
  }, [problemData, selectedLanguage]);

  // ---------- AUTO JOIN ----------
  useEffect(() => {
    if (!session || !user || loadingSession) return;
    if (isHost || isParticipant) return;

    joinSessionMutation.mutate(id, { onSuccess: refetch });
  }, [session, user, loadingSession, isHost, isParticipant, id, refetch]);

  // ---------- REDIRECT WHEN COMPLETED ----------
  useEffect(() => {
    if (session?.status === "completed") {
      navigate("/dashboard");
    }
  }, [session, navigate]);

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);
    const result = await executeCode(selectedLanguage, code);
    setOutput(result);
    setIsRunning(false);
  };

  // ---------- END SESSION (BACKEND ONLY) ----------
  const handleEndSession = () => {
    if (!confirm("Are you sure you want to end this session?")) return;

    endSessionMutation.mutate(id, {
      onSuccess: () => navigate("/dashboard"),
    });
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/session/${id}`;
    navigator.clipboard.writeText(link);
    setIsCopied(true);
    toast.success("Invite link copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="h-screen bg-base-100 flex flex-col">
      <Navbar />

      <div className="flex-1">
        <PanelGroup direction="horizontal">
          {/* ================= LEFT ================= */}
          <Panel defaultSize={70} minSize={55}>
            <PanelGroup direction="vertical">
              {/* HEADER */}
              <Panel defaultSize={12} minSize={10}>
                <div className="px-6 py-4 border-b border-base-300 bg-base-100 flex justify-between items-center">
                  <div>
                    <h1 className="text-2xl font-bold">
                      {session?.problem || "Loading..."}
                    </h1>
                    <p className="text-sm text-base-content/60">
                      Host: {session?.host?.name} •{" "}
                      {(session?.participants?.length ?? 0) + 1}/{session?.maxParticipants ?? 100} participants
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`badge ${getDifficultyBadgeClass(
                        session?.difficulty
                      )}`}
                    >
                      {session?.difficulty}
                    </span>

                    {isHost && session?.status === "active" && (
                      <>
                        <button
                          onClick={handleCopyLink}
                          className="btn btn-outline btn-primary btn-sm gap-2"
                        >
                          {isCopied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
                          Copy Invite Link
                        </button>
                        <button
                          onClick={handleEndSession}
                          className="btn btn-error btn-sm gap-2"
                        >
                          <LogOutIcon className="w-4 h-4" />
                          End Session
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </Panel>

              <PanelResizeHandle className="h-2 bg-base-300 cursor-row-resize" />

              {/* PROBLEM */}
              <Panel defaultSize={40} minSize={25}>
                {problemData ? (
                  <ProblemDescription
                    problem={problemData}
                    allProblems={Object.values(PROBLEMS)}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <Loader2Icon className="w-8 h-8 animate-spin" />
                  </div>
                )}
              </Panel>

              <PanelResizeHandle className="h-2 bg-base-300 cursor-row-resize" />

              {/* CODE */}
              <Panel defaultSize={30} minSize={20}>
                <CodeEditorPanel
                  selectedLanguage={selectedLanguage}
                  code={code}
                  isRunning={isRunning}
                  onLanguageChange={(e) =>
                    setSelectedLanguage(e.target.value)
                  }
                  onCodeChange={setCode}
                  onRunCode={handleRunCode}
                  sessionId={id}
                />
              </Panel>

              <PanelResizeHandle className="h-2 bg-base-300 cursor-row-resize" />

              {/* OUTPUT */}
              <Panel defaultSize={18} minSize={15}>
                <OutputPanel output={output} />
              </Panel>
            </PanelGroup>
          </Panel>

          <PanelResizeHandle className="w-2 bg-base-300 cursor-col-resize" />

          {/* ================= RIGHT ================= */}
          <Panel defaultSize={30} minSize={25}>
            <div className="h-full bg-base-200 p-4">
              {isInitializingCall ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2Icon className="w-10 h-10 animate-spin" />
                </div>
              ) : !streamClient || !call ? (
                <div className="h-full flex items-center justify-center">
                  <PhoneOffIcon className="w-12 h-12 text-error" />
                </div>
              ) : (
                <StreamVideo client={streamClient}>
                  <StreamCall call={call}>
                    <VideoCallUI
                      chatClient={chatClient}
                      channel={channel}
                    />
                  </StreamCall>
                </StreamVideo>
              )}
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

export default SessionPage;
