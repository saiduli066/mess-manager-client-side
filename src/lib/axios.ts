import axios from "axios";

export const axiosInstance = axios.create({
  // baseURL: "https://mess-manager-backend.vercel.app/api/v1",
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true,
});
