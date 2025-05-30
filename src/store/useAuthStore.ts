/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";
import type { IAuthStore, IAuthUser, TLoginData, TSignupData } from "@/lib/types&interfaces/auth";

export const useAuthStore = create<IAuthStore>((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,
  isLoggingOut: false,
  isFetchingProfile: false,
  isUpdatingProfile: false,

  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });
      const res = await axiosInstance.get<IAuthUser>("/auth/check");
      set({ authUser: res.data });
      // console.log("Auth user in authCheck:",  res.data);
    } catch (error) {
      console.log("Auth Check Error:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data: TSignupData) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post<IAuthUser>("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data: TLoginData) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post<IAuthUser>("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    set({ isLoggingOut: true });
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Logout failed");
    } finally {
      set({ isLoggingOut: false });
    }
  },

  getProfile: async () => {
    set({ isFetchingProfile: true });

    try {
      const res = await axiosInstance.get("/profile");

      const { _id, name, email, phone, image, messName, role, createdAt, updatedAt } = res.data;

      set({
        authUser: { _id, name, email, phone, image, messName, role, createdAt, updatedAt },
      });
    } catch (err: any) {
      console.error("Failed to fetch profile:", err);
      toast.error(err.response?.data?.message || "Failed to load profile");
    } finally {
      set({ isFetchingProfile: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });

    try {
      const res = await axiosInstance.put("/profile", data);
      const updatedUser = res.data.user;

      set((state) => ({
        authUser: state.authUser
          ? { ...state.authUser, ...updatedUser }
          : null,
      }));

      toast.success("Profile updated successfully");
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
