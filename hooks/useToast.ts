import { useCallback } from "react";
import { toastManager } from "../utils/toastManager";

export const useToast = () => {
  const showToast = useCallback(
    (
      message: string,
      type: "success" | "error" | "warning" | "info" = "info",
      duration?: number,
    ) => {
      return toastManager.show(message, type, duration);
    },
    [],
  );

  return {
    showToast,
    success: useCallback(
      (message: string, duration?: number) =>
        toastManager.success(message, duration),
      [],
    ),
    error: useCallback(
      (message: string, duration?: number) =>
        toastManager.error(message, duration),
      [],
    ),
    warning: useCallback(
      (message: string, duration?: number) =>
        toastManager.warning(message, duration),
      [],
    ),
    info: useCallback(
      (message: string, duration?: number) =>
        toastManager.info(message, duration),
      [],
    ),
  };
};
