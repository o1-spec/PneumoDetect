import React from "react";
import { StyleSheet, View } from "react-native";
import { SectionHeader, StatCard } from "../premium";
import { COLORS, SPACING } from "../../constants/Theme";

interface ScanOverviewProps {
  stats: any;
  growthPercentage: number | null;
}

export const ScanOverview = ({
  stats,
  growthPercentage,
}: ScanOverviewProps) => {
  return (
    <View style={styles.section}>
      <SectionHeader title="Scan Overview" subtitle="This month's statistics" />
      <View style={styles.statsContainer}>
        <View style={styles.statRow}>
          <StatCard
            icon="document-text-outline"
            title="Total Scans"
            value={stats?.totalScans || 0}
            trend={
              growthPercentage !== null
                ? {
                    value: Math.abs(growthPercentage),
                    isPositive: growthPercentage >= 0,
                  }
                : undefined
            }
            color={COLORS.primary}
            backgroundColor={COLORS.primaryLight}
          />
          <StatCard
            icon="checkmark-circle-outline"
            title="Completed"
            value={stats?.completedScans || 0}
            color={COLORS.success}
            backgroundColor={COLORS.successLight}
          />
        </View>
        <View style={styles.statRow}>
          <StatCard
            icon="warning-outline"
            title="Pneumonia"
            value={stats?.failedScans || 0}
            color={COLORS.danger}
            backgroundColor={COLORS.dangerLight}
          />
          <StatCard
            icon="time-outline"
            title="Processing"
            value={stats?.processingScans || 0}
            color={COLORS.warning}
            backgroundColor={COLORS.warningLight}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  statsContainer: {
    gap: 12,
  },
  statRow: {
    flexDirection: "row",
    gap: 12,
  },
});
