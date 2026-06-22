import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Scan } from "../../types/api";
import { COLORS, SHADOWS, BORDER_RADIUS, SPACING } from "../../constants/Theme";

export interface RecentScansProps {
  recentScans: Scan[];
}

export const RecentScans: React.FC<RecentScansProps> = ({ recentScans }) => {
  const handleViewAll = () => {
    router.push("/(tabs)/history");
  };

  const handleScanPress = (scanId: string) => {
    router.push({
      pathname: "/report/[scanId]",
      params: { scanId },
    });
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Scans</Text>
        <TouchableOpacity onPress={handleViewAll}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      {recentScans.length > 0 ? (
        recentScans.map((scan) => (
          <TouchableOpacity
            key={scan.id}
            style={styles.scanCard}
            onPress={() => handleScanPress(scan.id)}
          >
            <View style={styles.scanHeader}>
              <View>
                <Text style={styles.scanId}>{scan.id}</Text>
                <Text style={styles.patientName}>
                  {scan.patient?.name || "Unknown Patient"}
                </Text>
              </View>
              <View
                style={[
                  styles.resultBadge,
                  scan.result === "PNEUMONIA"
                    ? styles.resultDanger
                    : styles.resultSafe,
                ]}
              >
                <Text
                  style={[
                    styles.resultText,
                    scan.result === "PNEUMONIA"
                      ? styles.resultTextDanger
                      : styles.resultTextSafe,
                  ]}
                >
                  {scan.result === "PNEUMONIA" ? "POSITIVE" : "NEGATIVE"}
                </Text>
              </View>
            </View>
            <View style={styles.scanFooter}>
              <Text style={styles.scanDate}>
                <Ionicons name="calendar-outline" size={12} color={COLORS.textTertiary} />{" "}
                {new Date(scan.createdAt).toLocaleDateString()}
              </Text>
              <Text style={styles.scanConfidence}>
                {scan.confidence || 0}% confidence
              </Text>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="document-outline" size={48} color={COLORS.border} />
          <Text style={styles.emptyStateTitle}>No Recent Scans</Text>
          <Text style={styles.emptyStateText}>
            Start by uploading a new X-ray scan
          </Text>
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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  viewAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "700",
  },
  scanCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  scanHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  scanId: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "700",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  resultBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  resultDanger: {
    backgroundColor: COLORS.dangerLight,
  },
  resultSafe: {
    backgroundColor: COLORS.successLight,
  },
  resultText: {
    fontSize: 12,
    fontWeight: "700",
  },
  resultTextDanger: {
    color: COLORS.danger,
  },
  resultTextSafe: {
    color: COLORS.success,
  },
  scanFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  scanDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  scanConfidence: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: "dashed",
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: 12,
    marginBottom: 4,
  },
  emptyStateText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});
