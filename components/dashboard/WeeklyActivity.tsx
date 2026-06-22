import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Card } from "../premium";
import { COLORS, BORDER_RADIUS, SPACING, SHADOWS } from "../../constants/Theme";

const screenWidth = Dimensions.get("window").width;

export interface WeeklyActivityProps {
  chartData: {
    labels: string[];
    datasets: {
      data: number[];
      color?: (opacity: number) => string;
      strokeWidth?: number;
    }[];
  };
  growthPercentage: number | null;
  showGrowthMetric: boolean | null;
}

export const WeeklyActivity: React.FC<WeeklyActivityProps> = ({
  chartData,
  growthPercentage,
  showGrowthMetric,
}) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Weekly Activity</Text>
      <Text style={styles.headerSubtitle}>7-day scan trend</Text>
      <View style={{ height: 16 }} />
      <Card elevated="light">
        <LineChart
          data={chartData}
          width={screenWidth - 56}
          height={220}
          chartConfig={{
            backgroundColor: COLORS.card,
            backgroundGradientFrom: COLORS.card,
            backgroundGradientTo: COLORS.card,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(71, 85, 105, ${opacity})`,
            style: {
              borderRadius: BORDER_RADIUS.lg,
            },
            propsForDots: {
              r: "5",
              strokeWidth: "2",
              stroke: COLORS.primary,
            },
          }}
          bezier
          style={styles.chart}
        />
        <View style={styles.chartFooter}>
          <View style={styles.chartLegend}>
            <View style={styles.legendDot} />
            <Text style={styles.legendText}>Scans per day</Text>
          </View>
          <Text style={[
            styles.chartSubtext,
            growthPercentage !== null && growthPercentage < 0 && { color: COLORS.danger }
          ]}>
            {showGrowthMetric && growthPercentage !== null
              ? growthPercentage > 0
                ? `↑ ${growthPercentage.toFixed(1)}% vs last week`
                : growthPercentage < 0
                  ? `↓ ${Math.abs(growthPercentage).toFixed(1)}% vs last week`
                  : "→ No change vs last week"
              : "No comparison data"}
          </Text>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontWeight: "500",
  },
  chart: {
    marginVertical: 8,
    borderRadius: BORDER_RADIUS.lg,
  },
  chartFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  chartLegend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  legendText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  chartSubtext: {
    fontSize: 13,
    color: COLORS.success,
    fontWeight: "600",
  },
});
