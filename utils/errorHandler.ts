import { AxiosError } from "axios";

/**
 * Extract error message from various error types
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as any;

    // Check for nested message
    if (data?.message) {
      return data.message;
    }

    // Check for error field
    if (data?.error) {
      return data.error;
    }

    // Fallback to status text
    return error.message || "An error occurred";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
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
