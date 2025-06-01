/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from "@/lib/axios";
import type { MessState } from "@/lib/types&interfaces/mess";
import { toast } from "sonner";
import { create } from "zustand";

export const useMessStore = create<MessState>((set) => ({
  mess: null,
  members: [],
  entriesReport: null,
  isLoading: false,

  createMess: async (name) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.post("/create-mess", { name });
      set({ mess: res.data.mess });
      toast.success("Mess created successfully");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create mess");
    } finally {
      set({ isLoading: false });
    }
  },

  joinMess: async (code) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.post("/join-mess", { code });
      toast.success(res.data.message || "Joined mess successfully");
      await useMessStore.getState().getMessInfo();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to join mess");
    } finally {
      set({ isLoading: false });
    }
  },

  getMessInfo: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get("/mess/my-mess");
      set({ mess: res.data.mess });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to fetch mess info");
    } finally {
      set({ isLoading: false });
    }
  },

  leaveMess: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.put("/mess/leave");
      toast.success(res.data.message || "Left mess successfully");
      set({ mess: null, members: [], entriesReport: null });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to leave mess");
    } finally {
      set({ isLoading: false });
    }
  },

  getMessMembers: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get("/mess-members");
      set({ members: res.data.membersData });
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to fetch mess members"
      );
    } finally {
      set({ isLoading: false });
    }
  },

  addMessEntry: async (type, entries) => {
    try {
      set({ isLoading: true });
      await axiosInstance.post("/mess-entries", {
        type,
        entries, 
      });
      toast.success(`${type === "meal" ? "Meal" : "Deposit"} added`);
      await useMessStore.getState().getMessMembers();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to add entry");
    } finally {
      set({ isLoading: false });
    }
  },
  

  getMessEntries: async (messId, month?: string, year?: string) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get(`/mess-entries/${messId}`, {
        params: { month, year }, 
      });
      set({ entriesReport: res.data });
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to fetch mess entries"
      );
    } finally {
      set({ isLoading: false });
    }
  }
  
}));