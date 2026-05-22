import { AxiosError } from "axios";

// Declare __DEV__ to prevent TypeScript compilation errors if not globally configured
declare const __DEV__: boolean;

/**
 * Sanitize error message to prevent database/server traceback leaks in production
 */
const sanitizeMessage = (message: string): string => {
  if (!message) return "An unexpected error occurred";
  
  const lowerMsg = message.toLowerCase();
  const sensitivePatterns = [
    "prisma",
    "sql",
    "postgres",
    "database",
    "query",
    "connection refused",
    "internal server error",
    "stack",
    "trace",
    "gunicorn",
    "nest",
    "schema",
    "foreign key",
    "unique constraint"
  ];
  
  const hasSensitive = sensitivePatterns.some((pattern) => lowerMsg.includes(pattern));
  
  if (hasSensitive) {
    // Show full message in DEV mode for debugging, but mask in production
    try {
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        return `[DEV ONLY] ${message}`;
      }
    } catch (e) {}
    return "A service connection error occurred. Please try again shortly.";
  }
  
  return message;
};

/**
 * Extract error message from various error types
 */
export const getErrorMessage = (error: unknown): string => {
  let rawMessage = "An unexpected error occurred";

  if (error instanceof AxiosError) {
    const data = error.response?.data as any;

    // Check for nested message
    if (data?.message) {
      rawMessage = Array.isArray(data.message) ? data.message[0] : data.message;
    } else if (data?.error) {
      rawMessage = data.error;
    } else {
      rawMessage = error.message || "An error occurred";
    }
  } else if (error instanceof Error) {
    rawMessage = error.message;
  }

  return sanitizeMessage(rawMessage);
};

/**
 * Extract validation errors from API response
 */
export const getValidationErrors = (error: unknown): Record<string, string> => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as any;

    // Check for errors object (common in NestJS)
    if (data?.errors && typeof data.errors === "object") {
      return data.errors;
    }

    // Check for message array
    if (Array.isArray(data?.message)) {
      const errorMap: Record<string, string> = {};
      data.message.forEach((msg: string, index: number) => {
        errorMap[`error_${index}`] = msg;
      });
      return errorMap;
    }
  }

  return {};
};

/**
 * Check if error is network related
 */
export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return (
      !error.response ||
      error.code === "ECONNABORTED" ||
      error.code === "ECONNREFUSED"
    );
  }
  return false;
};

/**
 * Check if error is authentication related
 */
export const isAuthError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.response?.status === 401 || error.response?.status === 403;
  }
  return false;
};

/**
 * Check if error is validation related
 */
export const isValidationError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.response?.status === 400;
  }
  return false;
};
