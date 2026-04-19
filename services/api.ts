import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { Platform } from "react-native";
import { clearAuthData, getAccessToken } from "../utils/secureStorage";

// Extend global to avoid TypeScript errors
declare global {
  var authLogoutEvent: (() => void) | undefined;
}

// Platform-specific base URL
const API_URL =
  Platform.OS === "android" ? "http://10.0.2.2:3000" : "http://localhost:3000";

/**
 * Create axios instance with default config
 */
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor: Add JWT token to all requests
 */
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn("Failed to retrieve auth token:", error);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

/**
 * Response interceptor: Handle 401 and other errors
 */
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const { response } = error;

    if (response?.status === 401) {
      // Token expired or invalid - clear storage and emit logout event
      try {
        await clearAuthData();

        // Emit a custom event that auth context can listen to
        // This will trigger app-wide logout
        if (global.authLogoutEvent) {
          global.authLogoutEvent();
        }
      } catch (err) {
        console.warn("Failed to clear auth data:", err);
      }
    }

    // Re-throw error for component-level handling
    return Promise.reject(error);
  },
);

export default api;
export { API_URL };
