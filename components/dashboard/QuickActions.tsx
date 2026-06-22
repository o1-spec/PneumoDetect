import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SectionHeader } from "../premium/SectionHeader";
import { COLORS, SHADOWS, BORDER_RADIUS, SPACING } from "../../constants/Theme";

interface QuickActionsProps {
  isAdmin: boolean;
}

export const QuickActions = ({ isAdmin }: QuickActionsProps) => {
  return (
    <View style={styles.section}>
      <SectionHeader title="Quick Actions" subtitle="Get started in seconds" />
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/analysis/upload")}
        >
          <View
            style={[
              styles.actionIconBg,
              { backgroundColor: COLORS.primaryLight },
            ]}
          >
            <Ionicons name="add-circle-outline" size={28} color={COLORS.primary} />
          </View>
          <Text style={styles.actionButtonText}>New Scan</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/(tabs)/history")}
        >
          <View
            style={[
              styles.actionIconBg,
              { backgroundColor: COLORS.successLight },
            ]}
          >
            <Ionicons name="time-outline" size={28} color={COLORS.success} />
          </View>
          <Text style={styles.actionButtonText}>History</Text>
        </TouchableOpacity>
      </View>

      {isAdmin && (
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/(tabs)/(admin)/all-scans")}
          >
            <View
              style={[
                styles.actionIconBg,
                { backgroundColor: COLORS.primaryLight },
              ]}
            >
              <Ionicons name="bar-chart-outline" size={28} color={COLORS.primary} />
            </View>
            <Text style={styles.actionButtonText}>All Scans</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/(tabs)/(admin)/users")}
          >
            <View
              style={[
                styles.actionIconBg,
                { backgroundColor: COLORS.warningLight },
              ]}
            >
              <Ionicons name="people-outline" size={28} color={COLORS.warning} />
            </View>
            <Text style={styles.actionButtonText}>Users</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  quickActionsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  actionIconBg: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
});
