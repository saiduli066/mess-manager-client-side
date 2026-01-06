/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { useMessStore } from "./useMessStore";
import type {
  IAuthStore,
  IAuthUser,
  TLoginData,
  TSignupData,
} from "@/lib/types&interfaces/auth";

export const useAuthStore = create<IAuthStore>((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isLoggingOut: false,
  isCheckingAuth: true,
  isFetchingProfile: false,
  isUpdatingProfile: false,

  checkAuth: async () => {
    // If we're offline, don't even try to hit the API
    if (!navigator.onLine) {
      set({ isCheckingAuth: false });
      console.log("⚠️ Offline - skipping auth check and keeping state");
      return;
    }

    try {
      set({ isCheckingAuth: true });
      const res = await axiosInstance.get<IAuthUser>("/auth/check");
      set({ authUser: res.data });
    } catch (error: any) {
      // Double check offline status in case it changed during request
      if (navigator.onLine) {
        console.log("❌ Auth check failed");
        set({ authUser: null });
      } else {
        console.log("⚠️ Offline - keeping auth state");
      }
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data: TSignupData) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post<IAuthUser>("/auth/signup", data);
      set({ authUser: res.data });
      // Mark user as having visited
      localStorage.setItem("hasVisited", "true");
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
      // Mark user as having visited
      localStorage.setItem("hasVisited", "true");
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
      // Keep hasVisited flag so user goes to login next time
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
      const userData = res.data;
      set({
        authUser: {
          _id: userData._id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          image: userData.image,
          messName: userData.messId?.name || "",
          role: userData.role,
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt,
          messId: userData.messId?._id,
          mealCounts: userData.mealCounts,
          mealSwitches: userData.mealSwitches,
        },
      });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load profile");
    } finally {
      set({ isFetchingProfile: false });
    }
  },

  updateProfile: async (data: {
    name?: string;
    phone?: string;
    image?: string;
  }) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/profile", data);
      const updatedUser = res.data.user;
      set((state) => ({
        authUser: state.authUser ? { ...state.authUser, ...updatedUser } : null,
      }));
      toast.success("Profile updated successfully");

      // Refresh members list to show updated name and phone
      const messStore = useMessStore.getState();
      if (messStore.mess?._id) {
        await messStore.getMessMembers();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
