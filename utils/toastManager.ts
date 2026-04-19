export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

let toastCallbacks: Array<(toast: Toast) => void> = [];

export const toastManager = {
  subscribe: (callback: (toast: Toast) => void) => {
    toastCallbacks.push(callback);
    return () => {
      toastCallbacks = toastCallbacks.filter((cb) => cb !== callback);
    };
  },

  show: (
    message: string,
    type: ToastType = "info",
    duration: number = 3000,
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast: Toast = { id, message, type, duration };
    toastCallbacks.forEach((callback) => callback(toast));
    return id;
  },

  success: (message: string, duration?: number) => {
    return toastManager.show(message, "success", duration);
  },

  error: (message: string, duration?: number) => {
    return toastManager.show(message, "error", duration || 4000);
  },

  warning: (message: string, duration?: number) => {
    return toastManager.show(message, "warning", duration || 3500);
  },

  info: (message: string, duration?: number) => {
    return toastManager.show(message, "info", duration || 3000);
  },
};
