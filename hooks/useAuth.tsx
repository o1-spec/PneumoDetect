import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import api from "../services/api";
import { usersAPI } from "../services/api.client";
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from "../types/api";
import {
  clearAllData,
  clearAuthData,
  getAccessToken,
  getUserData,
  storeAccessToken,
  storeUserData,
} from "../utils/secureStorage";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isSignedIn: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  clearSession: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
  verifyOTP: (data: { email: string; otp: string }) => Promise<User>;
  resendOTP: (email: string) => Promise<void>;
  changePassword: (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    bootstrapAsync();
  }, []);

  useEffect(() => {
    global.authLogoutEvent = handleLogoutEvent;
    return () => {
      global.authLogoutEvent = undefined;
    };
  }, []);

  const bootstrapAsync = async () => {
    try {
      const token = await getAccessToken();

      if (token) {
        try {
          const response = await usersAPI.getMe();
          const userData = response.data;
          await storeUserData(userData);
          setUser(userData);
        } catch (error) {
          const storedUserData = await getUserData();
          if (storedUserData) {
            setUser(storedUserData);
          }
        }
      }
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      const response = await api.post<AuthResponse>("/auth/login", credentials);
      const { accessToken, ...userData } = response.data;

      if (!userData.isVerified) {
        const error = new Error("Email not verified");
        (error as any).isNotVerified = true;
        throw error;
      }

      if (!accessToken) {
        throw new Error("No access token received from server");
      }

      await storeAccessToken(accessToken);
      await storeUserData(userData);

      setUser(userData as User);
    } catch (error) {
      throw error;
    }
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    try {
      const response = await api.post<AuthResponse>("/auth/register", data);
    } catch (error) {
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
    } finally {
      await clearAuthData();
      setUser(null);
    }
  }, []);

  const clearSession = useCallback(async () => {
    try {
      await clearAllData();
      setUser(null);
    } catch (error) {}
  }, []);

  const handleLogoutEvent = useCallback(() => {
    logout();
  }, [logout]);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    try {
      const response = await api.patch<User>("/users/profile", data);
      const updatedUser = response.data;

      setUser(updatedUser);
      await storeUserData(updatedUser);
    } catch (error) {
      throw error;
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const response = await api.get<User>("/users/me");
      const userData = response.data;

      setUser(userData);
      await storeUserData(userData);
    } catch (error) {
      throw error;
    }
  }, []);

  const verifyOTP = useCallback(
    async (data: { email: string; otp: string }) => {
      try {
        const response = await api.post<AuthResponse>("/auth/verify-otp", data);
        const { accessToken, ...userData } = response.data;

        if (!accessToken) {
          throw new Error("No access token received");
        }

        await storeAccessToken(accessToken);
        await storeUserData(userData);
        setUser(userData as User);

        return userData;
      } catch (error) {
        console.error("OTP verification failed:", error);
        throw error;
      }
    },
    [],
  );

  const resendOTP = useCallback(async (email: string) => {
    try {
      await api.post("/auth/resend-otp", { email });
    } catch (error) {
      console.error("Failed to resend OTP:", error);
      throw error;
    }
  }, []);

  const changePassword = useCallback(
    async (data: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    }) => {
      try {
        if (data.newPassword !== data.confirmPassword) {
          throw new Error("Passwords do not match");
        }

        await api.post("/auth/change-password", {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        });
      } catch (error) {
        console.error("Password change failed:", error);
        throw error;
      }
    },
    [],
  );

  const deleteAccount = useCallback(async (password: string) => {
    try {
      await api.delete("/users/account", {
        data: { password },
      });

      // Clear all auth data and logout
      await clearAllData();
      setUser(null);
    } catch (error) {
      console.error("Account deletion failed:", error);
      throw error;
    }
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isSignedIn: !!user,
    login,
    register,
    logout,
    clearSession,
    updateProfile,
    refreshUser,
    verifyOTP,
    resendOTP,
    changePassword,
    deleteAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use auth context
 */
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
