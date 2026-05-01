import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../lib/axios.js";

export const useUserDb = () => {
  return useQuery({
    queryKey: ["userDb"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/users/me?t=${new Date().getTime()}`);
      return res.data.data; // The user object with role
    },
    retry: false, // Don't retry if it fails (e.g., user not created yet)
  });
};

export const useSetRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (role) => {
      const res = await axiosInstance.post("/users/role", { role });
      return res.data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["userDb"], data);
      queryClient.invalidateQueries({ queryKey: ["userDb"] });
    },
  });
};
