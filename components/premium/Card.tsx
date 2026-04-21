import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padded?: boolean;
  elevated?: "light" | "medium" | "heavy";
  border?: boolean;
  backgroundColor?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  padded = true,
  elevated = "light",
  border = true,
  backgroundColor = "#FFFFFF",
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
    borderRadius: 14,
    overflow: "hidden",
  },
  padded: {
    padding: 16,
  },
  elevationLight: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  elevationMedium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  elevationHeavy: {
    shadowColor: "#0B5ED7",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  withBorder: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
});
