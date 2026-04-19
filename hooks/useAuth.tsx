import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import api from "../services/api";
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from "../types/api";
import {
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
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
  verifyOTP: (data: { email: string; otp: string }) => Promise<void>;
  resendOTP: (email: string) => Promise<void>;
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
      const userData = await getUserData();

      if (token && userData) {
        setUser(userData);
      }
    } catch (e) {
      console.warn("Failed to restore session:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      const response = await api.post<AuthResponse>("/auth/login", credentials);
      const { accessToken, ...userData } = response.data;

      if (!accessToken) {
        throw new Error("No access token received from server");
      }

      await storeAccessToken(accessToken);
      await storeUserData(userData);

      setUser(userData as User);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    try {
      const response = await api.post<AuthResponse>("/auth/register", data);
      const { accessToken, ...userData } = response.data;

      if (!accessToken) {
        throw new Error("No access token received from server");
      }

      await storeAccessToken(accessToken);
      await storeUserData(userData);

      setUser(userData as User);
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.warn("Logout API call failed:", error);
    } finally {
      await clearAuthData();
      setUser(null);
    }
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
      console.error("Profile update failed:", error);
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
      console.error("Failed to refresh user:", error);
      throw error;
    }
  }, []);

  const verifyOTP = useCallback(
    async (data: { email: string; otp: string }) => {
      try {
        await api.post("/auth/verify-otp", data);
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

  const value: AuthContextType = {
    user,
    isLoading,
    isSignedIn: !!user,
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
    verifyOTP,
    resendOTP,
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
