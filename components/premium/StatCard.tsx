import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card } from "./Card";

interface StatCardProps {
  icon: string;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
  backgroundColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  value,
  subtitle,
  trend,
  color = "#0B5ED7",
  backgroundColor = "rgba(11, 94, 215, 0.08)",
}) => {
  return (
    <Card elevated="light" padded={true}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor }]}>
          <Ionicons name={icon as any} size={24} color={color} />
        </View>
        {trend && (
          <View
            style={[
              styles.trendBadge,
              trend.isPositive ? styles.trendPositive : styles.trendNegative,
            ]}
          >
            <Ionicons
              name={trend.isPositive ? "arrow-up" : "arrow-down"}
              size={12}
              color={trend.isPositive ? "#10B981" : "#EF4444"}
            />
            <Text
              style={[
                styles.trendText,
                trend.isPositive
                  ? styles.trendTextPositive
                  : styles.trendTextNegative,
              ]}
            >
              {Math.abs(trend.value)}%
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  trendPositive: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
  },
  trendNegative: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
  },
  trendText: {
    fontSize: 12,
    fontWeight: "600",
  },
  trendTextPositive: {
    color: "#10B981",
  },
  trendTextNegative: {
    color: "#EF4444",
  },
  title: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  value: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "400",
  },
});
