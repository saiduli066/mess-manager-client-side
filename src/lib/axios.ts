import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://mess-manager-backend.vercel.app/api/v1",
  withCredentials: true,
});

// Response interceptor - handle network errors gracefully
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't show error toasts for failed requests - let components handle it
    // This prevents auth check failures from showing errors
    return Promise.reject(error);
  }
);
