import api from "./api";

export const adminService = {
  getDashboardStats: async () => {
    try {
      const res = await api.get("/admin/dashboard");
      // Interceptor returns full body: { success, message, data, pagination }
      return res.data || res;
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
      return null;
    }
  },

  getActivityLogs: async (params = {}) => {
    try {
      const res = await api.get("/admin/activity-logs", { params });
      // Backend sends: { success, message, data: logs[], pagination: { pagination: {...} } }
      const logs = Array.isArray(res.data) ? res.data : (res.data?.logs || []);
      return {
        logs,
        pagination: res.pagination?.pagination || res.pagination || null,
      };
    } catch (error) {
      console.error("Failed to fetch activity logs:", error);
      return { logs: [], pagination: null };
    }
  },

  getReports: async () => {
    try {
      const res = await api.get("/admin/reports");
      return res.data || res;
    } catch (error) {
      console.error("Failed to fetch admin reports:", error);
      return null;
    }
  },

  getSettings: async () => {
    const res = await api.get("/admin/settings");
    return res.data || res;
  },

  updateSettings: async (settingsData) => {
    const res = await api.put("/admin/settings", settingsData);
    return res.data || res;
  },
};

