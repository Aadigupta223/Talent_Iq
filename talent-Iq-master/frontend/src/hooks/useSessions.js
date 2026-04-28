import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { sessionsApi } from "../api/sessions.js";

export const useCreateSession = () => {
  const result = useMutation({
    mutationKey: ["createSession"],
    mutationFn: sessionsApi.createSession,
    onSuccess: () => toast.success("Session created successfully!"),
    onError: (error) => toast.error(error.response?.data?.message || "Failed to create room"),
  });

  return result;
};

export const useActiveSessions = () => {
  const result = useQuery({
    queryKey: ["activeSessions"],
    queryFn: sessionsApi.getActiveSessions,
  });

  return result;
};

export const useMyRecentSessions = () => {
  const result = useQuery({
    queryKey: ["myRecentSessions"],
    queryFn: sessionsApi.getMyRecentSessions,
  });

  return result;
};

export const useSessionById = (id) => {
  const result = useQuery({
    queryKey: ["session", id],
    queryFn: () => sessionsApi.getSessionById(id),
    enabled: !!id, // it will make id boolean and if id is not present it will not run the query
    // refetchInterval: 5000, // refetch every 5 seconds to detect session status changes
    // refetchInterval: (query) => {
    //   return query.state.data?.status === "active" ? 5000 : false;
    // },
  });

  return result;
};

export const useJoinSession = () => {
  return useMutation({
    mutationKey: ["joinSession"],
    mutationFn: sessionsApi.joinSessionById,
    onSuccess: () => toast.success("Joined session successfully!"),
    onError: (error) => toast.error(error.response?.data?.message || "Failed to join session"),
  });
};

export const useEndSession = () => {
  return useMutation({
    mutationKey: ["endSession"],
    mutationFn: sessionsApi.endSessionById,
    onSuccess: () => toast.success("Session ended successfully!"),
    onError: (error) => toast.error(error.response?.data?.message || "Failed to end session"),
  });
};
