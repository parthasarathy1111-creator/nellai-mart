import api from "./api";

export const authService = {
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    if (response.success && response.data?.token) {
      localStorage.setItem("nellai_token", response.data.token);
      localStorage.setItem("nellai_user", JSON.stringify(response.data.user));
    }
    return response;
  },

  logout: async () => {
    localStorage.removeItem("nellai_token");
    sessionStorage.removeItem("nellai_token");
    localStorage.removeItem("nellai_user");
    return { success: true };
  },

  getProfile: async () => {
    const response = await api.get("/auth/profile");
    if (response.success && response.data) {
      localStorage.setItem("nellai_user", JSON.stringify(response.data));
    }
    return response.data;
  },

  getCurrentUser: () => {
    try {
      const stored = localStorage.getItem("nellai_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  getToken: () => {
    return localStorage.getItem("nellai_token") || sessionStorage.getItem("nellai_token");
  },

  isAuthenticated: () => {
    return !!(localStorage.getItem("nellai_token") || sessionStorage.getItem("nellai_token"));
  },
};
