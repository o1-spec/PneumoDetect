import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SectionHeader } from "../premium/SectionHeader";
import { COLORS, SHADOWS, BORDER_RADIUS, SPACING } from "../../constants/Theme";

interface SystemStatusCardProps {
  systemStatus: {
    aiModel: string;
    database: string;
    storage: string;
  } | null;
}

export const SystemStatusCard = ({ systemStatus }: SystemStatusCardProps) => {
  return (
    <View style={styles.section}>
      <SectionHeader title="System Status" subtitle="All services online" />
      <View style={styles.statusCard}>
        <View style={styles.statusRow}>
          <View style={styles.statusIndicator}>
            <View style={[styles.statusDot, styles.statusActive]} />
            <Text style={styles.statusText}>AI Model</Text>
          </View>
          <Text style={styles.statusValue}>
            {typeof systemStatus?.aiModel === "string"
              ? systemStatus.aiModel
              : "Operational"}
          </Text>
        </View>
        <View style={styles.statusRow}>
          <View style={styles.statusIndicator}>
            <View style={[styles.statusDot, styles.statusActive]} />
            <Text style={styles.statusText}>Database</Text>
          </View>
          <Text style={styles.statusValue}>
            {typeof systemStatus?.database === "string"
              ? systemStatus.database
              : "Connected"}
          </Text>
        </View>
        <View style={styles.statusRow}>
          <View style={styles.statusIndicator}>
            <View style={[styles.statusDot, styles.statusActive]} />
            <Text style={styles.statusText}>Storage</Text>
          </View>
          <Text style={styles.statusValue}>
            {typeof systemStatus?.storage === "string"
              ? systemStatus.storage
              : "78% Used"}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
    paddingTop: 10,
  },
  statusCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusActive: {
    backgroundColor: COLORS.success,
  },
  statusText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  statusValue: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
});
