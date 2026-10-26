import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Request Interceptor: Attach Bearer JWT token if stored
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("nellai_token") || sessionStorage.getItem("nellai_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Flatten payload & handle 401 Unauthorized
api.interceptors.response.use(
  (response) => {
    // Return standard response data body
    return response.data;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem("nellai_token");
        sessionStorage.removeItem("nellai_token");
        localStorage.removeItem("nellai_user");
      }
      const message =
        error.response.data?.message ||
        (Array.isArray(error.response.data?.errors) && error.response.data.errors[0]?.message) ||
        "An unexpected error occurred.";
      return Promise.reject(new Error(message));
    }
    if (error.request) {
      return Promise.reject(new Error("Unable to connect to Nellai Mart server. Please check your connection."));
    }
    return Promise.reject(error);
  }
);

export default api;
