import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { COLORS, BORDER_RADIUS, SHADOWS } from "../../constants/Theme";

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padded?: boolean;
  elevated?: "none" | "light" | "medium" | "heavy";
  border?: boolean;
  backgroundColor?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  padded = true,
  elevated = "light",
  border = true,
  backgroundColor = COLORS.card,
}) => {
  return (
    <View
      style={[
        styles.card,
        padded && styles.padded,
        elevated === "light" && styles.elevationLight,
        elevated === "medium" && styles.elevationMedium,
        elevated === "heavy" && styles.elevationHeavy,
        border && styles.withBorder,
        { backgroundColor },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: "hidden",
  },
  padded: {
    padding: 16,
  },
  elevationLight: SHADOWS.light,
  elevationMedium: SHADOWS.medium,
  elevationHeavy: SHADOWS.heavy,
  withBorder: {
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});
