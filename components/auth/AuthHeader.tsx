import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS, SPACING } from "../../constants/Theme";
import { Ionicons } from "@expo/vector-icons";

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
}

/**
 * Professional clinical header with brand identifier and messaging
 */
export const AuthHeader: React.FC<AuthHeaderProps> = ({
  title,
  subtitle,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.brandRow}>
        <Ionicons name="pulse-outline" size={14} color={COLORS.primary} style={styles.brandIcon} />
        <Text style={styles.brandText}>PNEUMODETECT AI</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    width: "100%",
    marginBottom: 20,
    paddingTop: 8,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  brandIcon: {
    marginRight: 6,
  },
  brandText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    textAlign: "left",
  },
});
