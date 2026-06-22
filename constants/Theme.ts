import { Platform } from "react-native";

export const COLORS = {
  primary: "#4F46E5", // Indigo
  primaryLight: "#EEF2F6", // Tinted Slate
  secondary: "#06B6D4", // Cyan
  success: "#10B981", // Emerald
  successLight: "#ECFDF5",
  danger: "#EF4444", // Rose
  dangerLight: "#FEF2F2",
  warning: "#F59E0B", // Amber
  warningLight: "#FFFBEB",
  background: "#F8FAFC", // Slate 50
  card: "#FFFFFF",
  border: "#E2E8F0", // Slate 200
  textPrimary: "#0F172A", // Slate 900
  textSecondary: "#475569", // Slate 600
  textTertiary: "#94A3B8", // Slate 400
  icon: "#94A3B8",
};

export const GRADIENTS = {
  primary: ["#4F46E5", "#6366F1", "#06B6D4"] as const,
  success: ["#10B981", "#34D399"] as const,
  danger: ["#EF4444", "#F87171"] as const,
  dark: ["#0F172A", "#1E293B"] as const,
  light: ["#F8FAFC", "#F1F5F9"] as const,
};

export const SHADOWS = {
  light: {
    shadowColor: "rgba(79, 70, 229, 0.08)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  medium: {
    shadowColor: "rgba(79, 70, 229, 0.12)",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
  heavy: {
    shadowColor: "rgba(79, 70, 229, 0.18)",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
};

export const THEME = {
  COLORS,
  GRADIENTS,
  SHADOWS,
  SPACING,
  BORDER_RADIUS,
};
