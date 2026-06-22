import { Platform } from "react-native";

export const COLORS = {
  primary: "#2563EB", // Primary Blue
  primaryLight: "#EEF2F6", // Tinted Slate
  secondary: "#0EA5A4", // Medical Teal
  secondaryLight: "#E6F4F4", // Light Teal
  success: "#16A34A", // Clinical Green
  successLight: "#F0FDF4",
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
  primary: ["#2563EB", "#1D4ED8", "#0EA5A4"] as const,
  success: ["#16A34A", "#22C55E"] as const,
  danger: ["#EF4444", "#F87171"] as const,
  dark: ["#0F172A", "#1E293B"] as const,
  light: ["#F8FAFC", "#F1F5F9"] as const,
};

export const SHADOWS = {
  light: {
    shadowColor: "rgba(15, 23, 42, 0.05)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  medium: {
    shadowColor: "rgba(15, 23, 42, 0.08)",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  heavy: {
    shadowColor: "rgba(15, 23, 42, 0.12)",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
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
  md: 14,
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
