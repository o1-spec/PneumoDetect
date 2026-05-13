import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Card } from "../premium";

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
            backgroundColor: "#FFFFFF",
            backgroundGradientFrom: "#FFFFFF",
            backgroundGradientTo: "#FFFFFF",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(11, 94, 215, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "5",
              strokeWidth: "2",
              stroke: "#0B5ED7",
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
          <Text style={styles.chartSubtext}>
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
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
    fontWeight: "500",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  chartFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
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
    backgroundColor: "#0B5ED7",
  },
  legendText: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  chartSubtext: {
    fontSize: 13,
    color: "#10B981",
    fontWeight: "600",
  },
});
