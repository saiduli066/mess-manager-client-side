// lib/types&interfaces/auth.ts
export type TLoginData = {
  email: string;
  password: string;
};

export type TSignupData = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  image?: string;
};

export interface IAuthUser {
  _id: string;
  name: string;
  email: string;
  role: "member" | "admin";
  image?: string;
  phone?: string;
  messName: string;
  createdAt: string;
  updatedAt: string;
  messId?: string;
  mealCounts?: {
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

export interface IAuthStore {
  authUser: IAuthUser | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  isCheckingAuth: boolean;
  isFetchingProfile: boolean;
  isUpdatingProfile: boolean;

  checkAuth: () => Promise<void>;
  signup: (data: TSignupData) => Promise<void>;
  login: (data: TLoginData) => Promise<void>;
  logout: () => Promise<void>;
  getProfile: () => Promise<void>;
  updateProfile: (data: {
    name?: string;
    phone?: string;
    image?: string;
  }) => Promise<void>;
}
