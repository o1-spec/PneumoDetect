import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { Platform } from "react-native";
import { logger } from "../utils/logger";
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
      logger.debug("Failed to retrieve access token", { error: String(error) });
    }

    // Log API request in development
    logger.logApiRequest(
      config.method?.toUpperCase() || "UNKNOWN",
      config.url || "",
      {
        hasAuth: !!config.headers.Authorization,
      },
    );

    return config;
  },
  (error: AxiosError) => {
    logger.error("Request interceptor error", { error: String(error) });
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    logger.logApiResponse(
      response.config.method?.toUpperCase() || "UNKNOWN",
      response.config.url || "",
      response.status,
    );
    return response;
  },
  async (error: AxiosError) => {
    const { response, config } = error;

    // Log API error
    logger.logApiError(
      config?.url || "unknown",
      response?.status,
      error.message,
      {
        method: config?.method?.toUpperCase(),
        timestamp: new Date().toISOString(),
      },
    );

    const isLogoutEndpoint = config?.url?.includes("/auth/logout");

    if (response?.status === 401 && !isLogoutEndpoint) {
      try {
        await clearAuthData();

        if (global.authLogoutEvent) {
          global.authLogoutEvent();
        }
      } catch (err) {
        logger.error("Logout error", { error: String(err) });
      }
    }

    return Promise.reject(error);
  },
);

export default api;
export { API_URL };
