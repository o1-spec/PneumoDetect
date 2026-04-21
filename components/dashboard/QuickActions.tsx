import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SectionHeader } from "../premium/SectionHeader";

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
              { backgroundColor: "rgba(11, 94, 215, 0.1)" },
            ]}
          >
            <Ionicons name="add-circle-outline" size={28} color="#0B5ED7" />
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
              { backgroundColor: "rgba(16, 185, 129, 0.1)" },
            ]}
          >
            <Ionicons name="time-outline" size={28} color="#10B981" />
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
                { backgroundColor: "rgba(59, 130, 246, 0.1)" },
              ]}
            >
              <Ionicons name="bar-chart-outline" size={28} color="#3B82F6" />
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
                { backgroundColor: "rgba(168, 85, 247, 0.1)" },
              ]}
            >
              <Ionicons name="people-outline" size={28} color="#A855F7" />
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
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  quickActionsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  actionIconBg: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1C1C1E",
  },
});
