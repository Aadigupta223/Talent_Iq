import axiosInstance from "../lib/axios.js";

export const sessionsApi = {
  createSession: async (data) => {
    const response = await axiosInstance.post("/sessions", data);
    return response.data.data;
  },

  getActiveSessions: async () => {
    const response = await axiosInstance.get("/sessions/active");
    return response.data.data;
  },

  getMyRecentSessions: async () => {
    const response = await axiosInstance.get("/sessions/my-recent");
    return response.data.data;
  },

  getSessionById: async (id) => {
    const response = await axiosInstance.get(`/sessions/${id}`);
    return response.data.data;
  },

  joinSessionById: async (id) => {
    const response = await axiosInstance.post(`/sessions/${id}/join`);
    return response.data.data;
  },

  endSessionById: async (id) => {
    const response = await axiosInstance.post(`/sessions/${id}/end`);
    return response.data.data;
  },

  getStreamToken: async () => {
    const response = await axiosInstance.get("/chat/token");
    return response.data.data;
  },
};
