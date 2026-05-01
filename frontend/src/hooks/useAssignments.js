import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAssignments = () => {
  return useQuery({
    queryKey: ["assignments"],
    queryFn: async () => {
      const res = await axiosInstance.get("/assignments");
      return res.data.data;
    },
  });
};

export const useAssignmentById = (id) => {
  return useQuery({
    queryKey: ["assignments", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/assignments/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
};

export const useCreateAssignment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (assignmentData) => {
      const res = await axiosInstance.post("/assignments", assignmentData);
      return res.data.data;
    },
    onSuccess: () => {
      toast.success("Assignment created successfully");
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create assignment");
    },
  });
};

export const useSubmitAssignment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, code, language }) => {
      const res = await axiosInstance.post(`/assignments/${id}/submit`, { code, language });
      return res.data.data;
    },
    onSuccess: (_, variables) => {
      toast.success("Assignment submitted successfully");
      queryClient.invalidateQueries({ queryKey: ["assignments", variables.id, "mySubmission"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to submit assignment");
    },
  });
};

export const useAssignmentSubmissions = (id) => {
  return useQuery({
    queryKey: ["assignments", id, "submissions"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/assignments/${id}/submissions`);
      return res.data.data;
    },
    enabled: !!id,
  });
};

export const useMySubmission = (id) => {
  return useQuery({
    queryKey: ["assignments", id, "mySubmission"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/assignments/${id}/my-submission`);
      return res.data.data;
    },
    enabled: !!id,
  });
};
