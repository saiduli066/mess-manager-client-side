// // lib/types&interfaces/mess.ts

// // Base Types
// export type EntryType = "deposit";
// export type TMemberRole = "member" | "admin";
// export type MealType = "breakfast" | "lunch" | "dinner";

// // User Types
// export interface TUser {
//   _id: string;
//   name: string;
//   email: string;
//   image: string;
//   role: TMemberRole;
//   phone?: string;
//   totalDeposit?: number;
//   mealCounts: {
//     breakfast: number;
//     lunch: number;
//     dinner: number;
//   };
//   mealSwitches: {
//     breakfast: {
//       isOn: boolean;
//       lastToggled?: string;
//     };
//     lunch: {
//       isOn: boolean;
//       lastToggled?: string;
//     };
//     dinner: {
//       isOn: boolean;
//       lastToggled?: string;
//     };
//   };
// }

// // Member Types
// export interface TMember {
//   _id: string;
//   name: string;
//   email: string;
//   image: string;
//   phone?: string;
//   totalDeposit: number;
//   role: TMemberRole;
//   mealCounts: {
//     breakfast: number;
//     lunch: number;
//     dinner: number;
//   };
//   mealSwitches?: {
//     breakfast: {
//       isOn: boolean;
//       lastToggled?: string;
//     };
//     lunch: {
//       isOn: boolean;
//       lastToggled?: string;
//     };
//     dinner: {
//       isOn: boolean;
//       lastToggled?: string;
//     };
//   };
// }

// // Utility function to calculate total meals
// export const getTotalMeals = (mealCounts: {
//   breakfast: number;
//   lunch: number;
//   dinner: number;
// }): number => {
//   return mealCounts.breakfast + mealCounts.lunch + mealCounts.dinner;
// };

// // Mess Types
// export interface TMess {
//   _id: string;
//   name: string;
//   code: string;
//   createdBy: string;
//   members: string[];
//   mealSettings: {
//     breakfast: {
//       enabled: boolean;
//       startTime: string;
//       endTime: string;
//     };
//     lunch: {
//       enabled: boolean;
//       startTime: string;
//       endTime: string;
//     };
//     dinner: {
//       enabled: boolean;
//       startTime: string;
//       endTime: string;
//     };
//   };
//   createdAt?: string;
//   updatedAt?: string;
// }

// // Mess Entry Types
// export interface MessEntryInput {
//   userId: string;
//   amount: number;
//   type?: EntryType;
// }

// export interface MessEntry {
//   _id: string;
//   userId: string;
//   messId: string;
//   amount: number;
//   type: EntryType;
//   date: string;
//   createdBy: string;
// }

// export interface MessEntrySummary {
//   userId: string;
//   name: string;
//   email: string;
//   image: string;
//   totalMeal: number;
//   totalDeposit: number;
//   balance: number;
//   mealCounts?: {
//     breakfast: number;
//     lunch: number;
//     dinner: number;
//   };
// }

// export interface EntryReport {
//   messName: string;
//   messCode: string;
//   reportMonth: string;
//   totalMeals: number;
//   totalDeposits: number;
//   mealRate: number;
//   summary: MessEntrySummary[];
// }

// // Meal Switch Types
// export interface MealSwitchState {
//   isOn: boolean;
//   lastToggled?: string;
// }

// export interface MealSwitchStatus {
//   switchState: boolean;
//   lastToggled?: string;
//   mealCount: number;
//   isWithinTime: boolean;
//   timeRange: string;
//   enabled: boolean;
//   counted?: boolean;
// }

// export interface AllSwitchStatuses {
//   statuses: {
//     breakfast: MealSwitchStatus;
//     lunch: MealSwitchStatus;
//     dinner: MealSwitchStatus;
//   };
//   currentTime: string;
//   mealSettings: TMess["mealSettings"];
// }

// export interface MemberWithSwitches {
//   _id: string;
//   name: string;
//   image?: string;
//   role: TMemberRole;
//   mealSwitches: {
//     breakfast: {
//       isOn: boolean;
//       lastToggled?: string;
//     };
//     lunch: {
//       isOn: boolean;
//       lastToggled?: string;
//     };
//     dinner: {
//       isOn: boolean;
//       lastToggled?: string;
//     };
//   };
//   mealCounts: {
//     breakfast: number;
//     lunch: number;
//     dinner: number;
//   };
// }

// export interface MembersStatusResponse {
//   members: MemberWithSwitches[];
//   activeCounts: {
//     breakfast: number;
//     lunch: number;
//     dinner: number;
//   };
//   currentTime: string;
//   mealSettings: TMess["mealSettings"];
//   totalMembers: number;
// }

// // Daily Meal Types
// export interface DailyMealRecord {
//   _id: string;
//   userId: string;
//   messId: string;
//   date: string;
//   meals: {
//     breakfast: {
//       taken: boolean;
//       takenAt?: string;
//       switchedBy?: string;
//       counted: boolean;
//     };
//     lunch: {
//       taken: boolean;
//       takenAt?: string;
//       switchedBy?: string;
//       counted: boolean;
//     };
//     dinner: {
//       taken: boolean;
//       takenAt?: string;
//       switchedBy?: string;
//       counted: boolean;
//     };
//   };
//   totalMeals: number;
//   createdAt?: string;
//   updatedAt?: string;
// }

// // Meal Details Types
// export interface MealDetailsResponse {
//   mealDetails: {
//     [userId: string]: {
//       user: {
//         _id: string;
//         name: string;
//         image?: string;
//         role: string;
//       };
//       dailyMeals: {
//         [date: string]: DailyMealRecord;
//       };
//     };
//   };
//   totals: {
//     [userId: string]: {
//       breakfast: number;
//       lunch: number;
//       dinner: number;
//       total: number;
//     };
//   };
//   dateRange: {
//     start: string;
//     end: string;
//   };
//   totalDays: number;
// }

// // Meal Summary Types
// export interface MealSummaryItem {
//   user: {
//     _id: string;
//     name: string;
//     image?: string;
//     role: string;
//   };
//   meals: {
//     breakfast: number;
//     lunch: number;
//     dinner: number;
//     total: number;
//   };
//   deposit: number;
//   lifetimeMeals?: {
//     breakfast: number;
//     lunch: number;
//     dinner: number;
//   };
// }

// export interface MealSummaryResponse {
//   summary: MealSummaryItem[];
//   month: number;
//   year: number;
//   totalDays: number;
// }

// // User Meal Statistics Types
// export interface UserMealStatistics {
//   date: string;
//   breakfast: number;
//   lunch: number;
//   dinner: number;
//   total: number;
// }

// export interface UserMealStatisticsResponse {
//   statistics: UserMealStatistics[];
//   monthlyTotals: {
//     breakfast: number;
//     lunch: number;
//     dinner: number;
//     total: number;
//   };
//   month: number;
//   year: number;
//   totalDays: number;
//   lifetimeTotals?: {
//     breakfast: number;
//     lunch: number;
//     dinner: number;
//   };
// }

// // Toggle Meal Switch Response
// export interface ToggleMealSwitchResponse {
//   message: string;
//   switchState: boolean;
//   mealType: MealType;
//   dailyTotal: number;
// }

// // NEW: Switch Loading State
// export interface SwitchLoadingState {
//   breakfast: boolean;
//   lunch: boolean;
//   dinner: boolean;
// }

// // API Response Types
// export interface ApiResponse<T> {
//   success: boolean;
//   data?: T;
//   message?: string;
//   error?: string;
// }

// export interface MessJoinResponse {
//   message: string;
//   mess: TMess;
// }

// export interface MessCreateResponse {
//   message: string;
//   mess: TMess;
// }

// export interface MessLeaveResponse {
//   message: string;
// }

// // Admin Management Response Types
// export interface PromoteMemberResponse {
//   message: string;
// }

// export interface DemoteMemberResponse {
//   message: string;
// }

// export interface RemoveMemberResponse {
//   message: string;
// }

// // Store State Type
// export interface MessState {
//   // Data
//   mess: TMess | null;
//   members: TMember[];
//   isLoading: boolean;
//   entriesReport: EntryReport | null;
//   mealDetails: MealDetailsResponse | null;
//   mealSummary: MealSummaryResponse | null;
//   userMealStatistics: UserMealStatisticsResponse | null;

//   // NEW: Individual loading states for meal switches
//   switchLoading: SwitchLoadingState;

//   // Mess Management
//   createMess: (name: string) => Promise<void>;
//   joinMess: (code: string) => Promise<void>;
//   leaveMess: () => Promise<void>;
//   getMessInfo: () => Promise<void>;
//   getMessMembers: () => Promise<void>;

//   // Deposits/Entries
//   addMessEntry: (entries: MessEntryInput[]) => Promise<void>;
//   getMessEntries: (
//     messId: string,
//     month?: string,
//     year?: string
//   ) => Promise<EntryReport>;

//   // Meal Switch System
//   toggleMealSwitch: (mealType: MealType) => Promise<ToggleMealSwitchResponse>;
//   getMealSwitchStatus: () => Promise<AllSwitchStatuses>;
//   getAllMembersMealStatus: () => Promise<MembersStatusResponse>;
//   getMealSummary: (
//     month?: number,
//     year?: number
//   ) => Promise<MealSummaryResponse>;
//   getUserMealStatistics: (
//     month?: number,
//     year?: number
//   ) => Promise<UserMealStatisticsResponse>;

//   // NEW: Admin Management Functions
//   promoteToAdmin: (messId: string, userId: string) => Promise<void>;
//   demoteToMember: (messId: string, userId: string) => Promise<void>;
//   removeMember: (messId: string, userId: string) => Promise<void>;
// }

// // Utility Types
// export interface DateRange {
//   start: string;
//   end: string;
// }

// export interface MealTimeSettings {
//   enabled: boolean;
//   startTime: string;
//   endTime: string;
// }

// export interface MealSettings {
//   breakfast: MealTimeSettings;
//   lunch: MealTimeSettings;
//   dinner: MealTimeSettings;
// }

// // Form Types
// export interface CreateMessFormData {
//   name: string;
// }

// export interface JoinMessFormData {
//   code: string;
// }

// export interface UpdateProfileFormData {
//   name?: string;
//   phone?: string;
//   image?: string;
// }

// // Admin Management Form Types
// export interface PromoteMemberFormData {
//   userId: string;
// }

// export interface DemoteMemberFormData {
//   userId: string;
// }

// export interface RemoveMemberFormData {
//   userId: string;
// }

// // Notification Types
// export interface Notification {
//   _id: string;
//   userId: string;
//   title: string;
//   message: string;
//   type: "info" | "success" | "warning" | "error";
//   read: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

// // Chart Data Types
// export interface MealChartData {
//   name: string;
//   value: number;
//   color?: string;
// }

// export interface DailyMealChartData {
//   date: string;
//   breakfast: number;
//   lunch: number;
//   dinner: number;
//   total: number;
// }

// // Admin Panel Types
// export interface AdminActionLog {
//   _id: string;
//   adminId: string;
//   action: "promote" | "demote" | "remove";
//   targetUserId: string;
//   targetUserName: string;
//   timestamp: string;
//   details?: string;
// }

// export interface AdminPanelStats {
//   totalMembers: number;
//   totalAdmins: number;
//   totalMealsThisMonth: number;
//   totalDepositsThisMonth: number;
//   activeMembers: number;
// }

// // Export all types for easy importing
// export type {
//   TMember as Member,
//   TMess as Mess,
//   TUser as User,
//   MealSwitchStatus as SwitchStatus,
//   MembersStatusResponse as AllMembersStatus,
//   SwitchLoadingState as MealSwitchLoading,
// };

// // Default export for convenience
// export default {
//   MealType: {
//     BREAKFAST: "breakfast" as MealType,
//     LUNCH: "lunch" as MealType,
//     DINNER: "dinner" as MealType,
//   },
//   Role: {
//     MEMBER: "member" as TMemberRole,
//     ADMIN: "admin" as TMemberRole,
//   },
//   EntryType: {
//     DEPOSIT: "deposit" as EntryType,
//   },
//   AdminAction: {
//     PROMOTE: "promote" as const,
//     DEMOTE: "demote" as const,
//     REMOVE: "remove" as const,
//   },
// };

// lib/types&interfaces/mess.ts

// Base Types
export type EntryType = "deposit";
export type TMemberRole = "member" | "admin";
export type MealType = "lunch" | "dinner";
export type NotificationType =
  | "meal_switch"
  | "deposit"
  | "system"
  | "info"
  | "success"
  | "warning"
  | "error";

// User Types
export interface TUser {
  _id: string;
  name: string;
  email: string;
  image: string;
  role: TMemberRole;
  phone?: string;
  totalDeposit?: number;
  mealCounts: {
    breakfast: number;
    lunch: number;
    dinner: number;
  };
  mealSwitches: {
    breakfast: {
      isOn: boolean;
      lastToggled?: string;
    };
    lunch: {
      isOn: boolean;
      lastToggled?: string;
    };
    dinner: {
      isOn: boolean;
      lastToggled?: string;
    };
  };
}

// Member Types
export interface TMember {
  _id: string;
  name: string;
  email: string;
  image: string;
  phone?: string;
  totalDeposit: number;
  role: TMemberRole;
  mealCounts: {
    breakfast: number;
    lunch: number;
    dinner: number;
  };
  mealSwitches?: {
    breakfast: {
      isOn: boolean;
      lastToggled?: string;
    };
    lunch: {
      isOn: boolean;
      lastToggled?: string;
    };
    dinner: {
      isOn: boolean;
      lastToggled?: string;
    };
  };
}

// Utility function to calculate total meals
export const getTotalMeals = (mealCounts: {
  breakfast: number;
  lunch: number;
  dinner: number;
}): number => {
  return mealCounts.breakfast + mealCounts.lunch + mealCounts.dinner;
};

// Mess Types
export interface TMess {
  _id: string;
  name: string;
  code: string;
  createdBy: string;
  members: string[];
  mealSettings: {
    breakfast: {
      enabled: boolean;
      startTime: string;
      endTime: string;
    };
    lunch: {
      enabled: boolean;
      startTime: string;
      endTime: string;
    };
    dinner: {
      enabled: boolean;
      startTime: string;
      endTime: string;
    };
  };
  createdAt?: string;
  updatedAt?: string;
}

// Mess Entry Types
export interface MessEntryInput {
  userId: string;
  amount: number;
  type?: EntryType;
}

export interface MessEntry {
  _id: string;
  userId: string;
  messId: string;
  amount: number;
  type: EntryType;
  date: string;
  createdBy: string;
}

export interface MessEntrySummary {
  userId: string;
  name: string;
  email: string;
  image: string;
  totalMeal: number;
  totalDeposit: number;
  balance: number;
  mealCounts?: {
    breakfast: number;
    lunch: number;
    dinner: number;
  };
  lifetimeDeposit?: number; // NEW: For reference
}

export interface EntryReport {
  messName: string;
  messCode: string;
  reportMonth: string;
  totalMeals: number;
  totalDeposits: number;
  mealRate: number;
  summary: MessEntrySummary[];
  settled?: boolean; // NEW: Indicates if monthly costs have been deducted
}

// Meal Switch Types
export interface MealSwitchState {
  isOn: boolean;
  lastToggled?: string;
}

export interface MealSwitchStatus {
  switchState: boolean;
  lastToggled?: string;
  mealCount: number;
  isWithinTime: boolean;
  timeRange: string;
  enabled: boolean;
  counted?: boolean;
}

export interface AllSwitchStatuses {
  statuses: {
    breakfast: MealSwitchStatus;
    lunch: MealSwitchStatus;
    dinner: MealSwitchStatus;
  };
  currentTime: string;
  mealSettings: TMess["mealSettings"];
}

export interface MemberWithSwitches {
  _id: string;
  name: string;
  image?: string;
  role: TMemberRole;
  mealSwitches: {
    breakfast: {
      isOn: boolean;
      lastToggled?: string;
    };
    lunch: {
      isOn: boolean;
      lastToggled?: string;
    };
    dinner: {
      isOn: boolean;
      lastToggled?: string;
    };
  };
  mealCounts: {
    breakfast: number;
    lunch: number;
    dinner: number;
  };
}

export interface MembersStatusResponse {
  members: MemberWithSwitches[];
  activeCounts: {
    breakfast: number;
    lunch: number;
    dinner: number;
  };
  currentTime: string;
  mealSettings: TMess["mealSettings"];
  totalMembers: number;
}

// Daily Meal Types
export interface DailyMealRecord {
  _id: string;
  userId: string;
  messId: string;
  date: string;
  meals: {
    breakfast: {
      taken: boolean;
      takenAt?: string;
      switchedBy?: string;
      counted: boolean;
    };
    lunch: {
      taken: boolean;
      takenAt?: string;
      switchedBy?: string;
      counted: boolean;
    };
    dinner: {
      taken: boolean;
      takenAt?: string;
      switchedBy?: string;
      counted: boolean;
    };
  };
  totalMeals: number;
  createdAt?: string;
  updatedAt?: string;
}

// Meal Details Types
export interface MealDetailsResponse {
  mealDetails: {
    [userId: string]: {
      user: {
        _id: string;
        name: string;
        image?: string;
        role: string;
      };
      dailyMeals: {
        [date: string]: DailyMealRecord;
      };
    };
  };
  totals: {
    [userId: string]: {
      breakfast: number;
      lunch: number;
      dinner: number;
      total: number;
    };
  };
  dateRange: {
    start: string;
    end: string;
  };
  totalDays: number;
}

// Meal Summary Types
export interface MealSummaryItem {
  user: {
    _id: string;
    name: string;
    image?: string;
    role: string;
  };
  meals: {
    breakfast: number;
    lunch: number;
    dinner: number;
    total: number;
  };
  deposit: number;
  lifetimeMeals?: {
    breakfast: number;
    lunch: number;
    dinner: number;
  };
}

export interface MealSummaryResponse {
  summary: MealSummaryItem[];
  month: number;
  year: number;
  totalDays: number;
}

// User Meal Statistics Types
export interface UserMealStatistics {
  date: string;
  lunch: number;
  dinner: number;
  total: number;
}

export interface UserMealStatisticsResponse {
  statistics: UserMealStatistics[];
  monthlyTotals: {
    lunch: number;
    dinner: number;
    total: number;
  };
  month: number;
  year: number;
  totalDays: number;
  lifetimeTotals?: {
    lunch: number;
    dinner: number;
  };
}

// Toggle Meal Switch Response
export interface ToggleMealSwitchResponse {
  message: string;
  switchState: boolean;
  mealType: MealType;
  dailyTotal: number;
}

// Switch Loading State
export interface SwitchLoadingState {
  lunch: boolean;
  dinner: boolean;
}

// NEW: Notification Types
export interface TNotification {
  _id: string;
  userId: string;
  messId?: string;
  title: string;
  message: string;
  type: NotificationType;
  data?: {
    mealType?: MealType;
    switchState?: boolean;
    toggledBy?: string;
    amount?: number;
  };
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface MessJoinResponse {
  message: string;
  mess: TMess;
}

export interface MessCreateResponse {
  message: string;
  mess: TMess;
}

export interface MessLeaveResponse {
  message: string;
}

// Admin Management Response Types
export interface PromoteMemberResponse {
  message: string;
}

export interface DemoteMemberResponse {
  message: string;
}

export interface RemoveMemberResponse {
  message: string;
}

// Store State Type
export interface MessState {
  // Data
  mess: TMess | null;
  members: TMember[];
  isLoading: boolean;
  entriesReport: EntryReport | null;
  mealDetails: MealDetailsResponse | null;
  mealSummary: MealSummaryResponse | null;
  userMealStatistics: UserMealStatisticsResponse | null;

  // NEW: Notifications
  notifications: TNotification[];

  // Individual loading states for meal switches
  switchLoading: SwitchLoadingState;

  // Mess Management
  createMess: (name: string) => Promise<void>;
  joinMess: (code: string) => Promise<void>;
  leaveMess: () => Promise<void>;
  getMessInfo: () => Promise<void>;
  getMessMembers: () => Promise<void>;

  // Deposits/Entries
  addMessEntry: (entries: MessEntryInput[]) => Promise<void>;
  getMessEntries: (
    messId: string,
    month?: string,
    year?: string
  ) => Promise<EntryReport>;

  // Meal Switch System
  toggleMealSwitch: (mealType: MealType) => Promise<ToggleMealSwitchResponse>;
  getMealSwitchStatus: () => Promise<AllSwitchStatuses>;
  getAllMembersMealStatus: () => Promise<MembersStatusResponse>;
  getMealSummary: (
    month?: number,
    year?: number
  ) => Promise<MealSummaryResponse>;
  getUserMealStatistics: (
    month?: number,
    year?: number
  ) => Promise<UserMealStatisticsResponse>;

  // Admin Management Functions
  promoteToAdmin: (messId: string, userId: string) => Promise<void>;
  demoteToMember: (messId: string, userId: string) => Promise<void>;
  removeMember: (messId: string, userId: string) => Promise<void>;

  // NEW: Notification Functions
  getNotifications: () => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;

  // NEW: Meal submission and retrieval functions
  submitMeals: (date: string, meals: any[]) => Promise<void>;
  getMealsForDate: (date: string) => Promise<any>;
}

// Utility Types
export interface DateRange {
  start: string;
  end: string;
}

export interface MealTimeSettings {
  enabled: boolean;
  startTime: string;
  endTime: string;
}

export interface MealSettings {
  breakfast: MealTimeSettings;
  lunch: MealTimeSettings;
  dinner: MealTimeSettings;
}

// Form Types
export interface CreateMessFormData {
  name: string;
}

export interface JoinMessFormData {
  code: string;
}

export interface UpdateProfileFormData {
  name?: string;
  phone?: string;
  image?: string;
}

// Admin Management Form Types
export interface PromoteMemberFormData {
  userId: string;
}

export interface DemoteMemberFormData {
  userId: string;
}

export interface RemoveMemberFormData {
  userId: string;
}

// Chart Data Types
export interface MealChartData {
  name: string;
  value: number;
  color?: string;
}

export interface DailyMealChartData {
  date: string;
  breakfast: number;
  lunch: number;
  dinner: number;
  total: number;
}

// Admin Panel Types
export interface AdminActionLog {
  _id: string;
  adminId: string;
  action: "promote" | "demote" | "remove";
  targetUserId: string;
  targetUserName: string;
  timestamp: string;
  details?: string;
}

export interface AdminPanelStats {
  totalMembers: number;
  totalAdmins: number;
  totalMealsThisMonth: number;
  totalDepositsThisMonth: number;
  activeMembers: number;
}

// Export all types for easy importing
export type {
  TMember as Member,
  TMess as Mess,
  TUser as User,
  TNotification as Notification,
  MealSwitchStatus as SwitchStatus,
  MembersStatusResponse as AllMembersStatus,
  SwitchLoadingState as MealSwitchLoading,
};

// Default export for convenience
export default {
  MealType: {
    BREAKFAST: "breakfast" as MealType,
    LUNCH: "lunch" as MealType,
    DINNER: "dinner" as MealType,
  },
  Role: {
    MEMBER: "member" as TMemberRole,
    ADMIN: "admin" as TMemberRole,
  },
  EntryType: {
    DEPOSIT: "deposit" as EntryType,
  },
  NotificationType: {
    MEAL_SWITCH: "meal_switch" as NotificationType,
    DEPOSIT: "deposit" as NotificationType,
    SYSTEM: "system" as NotificationType,
    INFO: "info" as NotificationType,
    SUCCESS: "success" as NotificationType,
    WARNING: "warning" as NotificationType,
    ERROR: "error" as NotificationType,
  },
  AdminAction: {
    PROMOTE: "promote" as const,
    DEMOTE: "demote" as const,
    REMOVE: "remove" as const,
  },
};
