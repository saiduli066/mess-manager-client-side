// Types
export type EntryType = "meal" | "deposit";

export type TMemberRole = "member" | "admin";

export interface TUser {
  _id: string;
  name: string;
  email: string;
  image: string;
  role: TMemberRole;
}

export interface TMember {
  _id: string;
  name: string;
  image: string;
  totalDeposit: number;
  mealCount: number;
  role: TMemberRole;
}

// Mess
export interface TMess {
  _id: string;
  name: string;
  code: string;
  createdBy: string;
  members: string[];
}

export interface MessEntryInput {
  userId: string;
  amount: number;
}

export interface MessEntrySummary {
  userId: string;
  name: string;
  email: string;
  image: string;
  totalMeal: number;
  totalDeposit: number;
  balance: number;
}

export interface EntryReport {
  messName: string;
  messCode: string;
  reportMonth: string;
  totalMeals: number;
  totalDeposits: number;
  mealRate: number;
  summary: MessEntrySummary[];
}

export interface MessState {
  mess: TMess | null;
  members: TMember[];
  isLoading: boolean;
  entriesReport: EntryReport | null;

  createMess: (name: string) => Promise<void>;
  joinMess: (code: string) => Promise<void>;
  leaveMess: () => Promise<void>;
  getMessInfo: () => Promise<void>;
  getMessMembers: () => Promise<void>;

  addMessEntry: (
    type: EntryType,
    entries: MessEntryInput[],
    messId?: string
  ) => Promise<void>;

  getMessEntries: (
    messId: string,
    month?: string,
    year?: string
  ) => Promise<void>;
}
