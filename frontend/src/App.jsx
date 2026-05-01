import { useAuth } from "@clerk/clerk-react";
import { Routes, Route, Navigate } from "react-router";
import HomePage from "./pages/HomePage";
import ProblemsPage from "./pages/ProblemsPage";
import DashboardPage from "./pages/DashboardPage";
import { Toaster } from "react-hot-toast";
import ProblemPage from "./pages/ProblemPage";
import SessionPage from "./pages/SessionPage";
import NotFoundPage from "./pages/NotFoundPage";
import AssignmentsPage from "./pages/AssignmentsPage";
import AssignmentDetailsPage from "./pages/AssignmentDetailsPage";
import RoleSelectionPage from "./pages/RoleSelectionPage";

function App() {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) return null;
  return (
    <>
      <Routes>
        <Route path='/' element={!isSignedIn ? <HomePage /> : <Navigate to={"/dashboard"} />} />
        <Route path='/select-role' element={isSignedIn ? <RoleSelectionPage /> : <Navigate to={"/"} />} />
        <Route path='/dashboard' element={isSignedIn ? <DashboardPage /> : <Navigate to={"/"} />} />
        <Route path='/problems' element={isSignedIn ? <ProblemsPage /> : <Navigate to={"/"} />} />
        <Route path='/problem/:id' element={isSignedIn ? <ProblemPage /> : <Navigate to={"/"} />} />
        <Route path='/session/:id' element={isSignedIn ? <SessionPage /> : <Navigate to={"/"} />} />
        <Route path='/assignments' element={isSignedIn ? <AssignmentsPage /> : <Navigate to={"/"} />} />
        <Route path='/assignments/:id' element={isSignedIn ? <AssignmentDetailsPage /> : <Navigate to={"/"} />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
      <Toaster toastOptions={{ duration: 5000 }} />
    </>
  );
}

export default App;
