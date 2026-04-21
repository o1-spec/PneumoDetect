import React from "react";
import { StyleSheet, View } from "react-native";
import { SectionHeader, StatCard } from "../premium";

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
            color="#0B5ED7"
            backgroundColor="rgba(11, 94, 215, 0.08)"
          />
          <StatCard
            icon="checkmark-circle-outline"
            title="Completed"
            value={stats?.completedScans || 0}
            color="#10B981"
            backgroundColor="rgba(16, 185, 129, 0.08)"
          />
        </View>
        <View style={styles.statRow}>
          <StatCard
            icon="warning-outline"
            title="Pneumonia"
            value={stats?.failedScans || 0}
            color="#EF4444"
            backgroundColor="rgba(239, 68, 68, 0.08)"
          />
          <StatCard
            icon="time-outline"
            title="Processing"
            value={stats?.processingScans || 0}
            color="#F59E0B"
            backgroundColor="rgba(245, 158, 11, 0.08)"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statsContainer: {
    gap: 12,
  },
  statRow: {
    flexDirection: "row",
    gap: 12,
  },
});
