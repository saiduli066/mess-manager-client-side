/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import type {
  MessState,
  TMess,
  TMember,
  EntryReport,
  MessEntryInput,
  AllSwitchStatuses,
  MembersStatusResponse,
  MealSummaryResponse,
  UserMealStatisticsResponse,
  ToggleMealSwitchResponse,
  MealType,
  SwitchLoadingState,
  TNotification,
} from "@/lib/types&interfaces/mess";

// Initial switch loading state
const initialSwitchLoading: SwitchLoadingState = {
  lunch: false,
  dinner: false,
};

export const useMessStore = create<MessState>((set, get) => ({
  mess: null,
  members: [],
  isLoading: false,
  entriesReport: null,
  mealDetails: null,
  mealSummary: null,
  userMealStatistics: null,
  notifications: [],
  switchLoading: initialSwitchLoading,

  createMess: async (name: string) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.post<{ mess: TMess }>("/create-mess", {
        name,
      });
      set({ mess: res.data.mess });
      toast.success("Mess created successfully");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create mess");
    } finally {
      set({ isLoading: false });
    }
  },

  joinMess: async (code: string) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.post("/join-mess", { code });
      toast.success(res.data.message || "Joined mess successfully");
      await get().getMessInfo();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to join mess");
    } finally {
      set({ isLoading: false });
    }
  },

  getMessInfo: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get<{ mess: TMess }>("/mess/my-mess");
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
      const res = await axiosInstance.patch("/leave-mess");
      toast.success(res.data.message || "Left mess successfully");
      set({
        mess: null,
        members: [],
        entriesReport: null,
        mealDetails: null,
        mealSummary: null,
        userMealStatistics: null,
        notifications: [], // NEW: Clear notifications on leave
        switchLoading: initialSwitchLoading,
      });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to leave mess");
    } finally {
      set({ isLoading: false });
    }
  },

  getMessMembers: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get<{ membersData: TMember[] }>(
        "/mess-members"
      );
      set({ members: res.data.membersData });
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to fetch mess members"
      );
    } finally {
      set({ isLoading: false });
    }
  },

  addMessEntry: async (entries: MessEntryInput[]) => {
    try {
      set({ isLoading: true });
      await axiosInstance.post("/mess-entries", { entries });
      toast.success("Deposits added successfully");
      await get().getMessMembers();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to add deposits");
    } finally {
      set({ isLoading: false });
    }
  },

  getMessEntries: async (
    messId: string,
    month?: string,
    year?: string
  ): Promise<EntryReport> => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get<EntryReport>(
        `/mess-entries/${messId}`,
        {
          params: { month, year },
        }
      );
      set({ entriesReport: res.data });
      return res.data;
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to fetch mess entries"
      );
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  toggleMealSwitch: async (
    mealType: MealType
  ): Promise<ToggleMealSwitchResponse> => {
    try {
      // Set individual loading state for this specific switch
      set((state) => ({
        switchLoading: {
          ...state.switchLoading,
          [mealType]: true,
        },
      }));

      const res = await axiosInstance.post<ToggleMealSwitchResponse>(
        "/meal-switch/toggle",
        { mealType }
      );

      toast.success(
        res.data.message || `${mealType} switch toggled successfully`
      );
      return res.data;
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || "Failed to toggle meal switch";
      toast.error(errorMessage);
      throw err;
    } finally {
      // Reset individual loading state
      set((state) => ({
        switchLoading: {
          ...state.switchLoading,
          [mealType]: false,
        },
      }));
    }
  },

  getMealSwitchStatus: async (): Promise<AllSwitchStatuses> => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get<AllSwitchStatuses>(
        "/meal-switch/status"
      );
      return res.data;
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to fetch meal status"
      );
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  getAllMembersMealStatus: async (): Promise<MembersStatusResponse> => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get<MembersStatusResponse>(
        "/meal-switch/members-status"
      );
      return res.data;
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to fetch members status"
      );
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  getMealSummary: async (
    month?: number,
    year?: number
  ): Promise<MealSummaryResponse> => {
    try {
      set({ isLoading: true });
      const params: any = {};
      if (month) params.month = month;
      if (year) params.year = year;

      const res = await axiosInstance.get<MealSummaryResponse>(
        "/meal-summary",
        { params }
      );
      set({ mealSummary: res.data });
      return res.data;
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to fetch meal summary"
      );
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  getUserMealStatistics: async (
    month?: number,
    year?: number
  ): Promise<UserMealStatisticsResponse> => {
    try {
      set({ isLoading: true });
      const params: any = {};
      if (month) params.month = month;
      if (year) params.year = year;

      const res = await axiosInstance.get<UserMealStatisticsResponse>(
        "/user-meal-statistics",
        { params }
      );
      set({ userMealStatistics: res.data });
      return res.data;
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to fetch meal statistics"
      );
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  // Admin Management Functions
  promoteToAdmin: async (messId: string, userId: string): Promise<void> => {
    try {
      set({ isLoading: true });
      await axiosInstance.patch(`/mess/${messId}/promote`, { userId });
      toast.success("Member promoted to admin successfully");
      await get().getMessMembers();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to promote member");
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  demoteToMember: async (messId: string, userId: string): Promise<void> => {
    try {
      set({ isLoading: true });
      await axiosInstance.patch(`/mess/${messId}/demote`, { userId });
      toast.success("Admin demoted to member successfully");
      await get().getMessMembers();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to demote admin");
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  removeMember: async (messId: string, userId: string): Promise<void> => {
    try {
      set({ isLoading: true });
      await axiosInstance.patch(`/mess/${messId}/remove-member`, { userId });
      toast.success("Member removed from mess successfully");
      await get().getMessMembers();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to remove member");
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  // NEW: Notification Functions
  getNotifications: async (): Promise<void> => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get<TNotification[]>("/notifications");
      set({ notifications: res.data });
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to fetch notifications"
      );
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  markNotificationAsRead: async (notificationId: string): Promise<void> => {
    try {
      const res = await axiosInstance.patch<{ notification: TNotification }>(
        `/notifications/${notificationId}/read`
      );

      // Update the notification in state
      set((state) => ({
        notifications: state.notifications.map((notif) =>
          notif._id === notificationId ? res.data.notification : notif
        ),
      }));
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to mark notification as read"
      );
      throw err;
    }
  },

  // NEW: Meal submission and retrieval functions
  submitMeals: async (date: string, meals: any[]): Promise<void> => {
    try {
      set({ isLoading: true });
      await axiosInstance.post("/meals/submit", { date, meals });
      toast.success("Meals submitted successfully");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to submit meals");
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  getMealsForDate: async (date: string): Promise<any> => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get("/meals/date", {
        params: { date },
      });
      return res.data;
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to fetch meals");
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },
}));
