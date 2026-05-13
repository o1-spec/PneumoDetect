import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Scan } from "../../types/api";

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
                <Ionicons name="calendar-outline" size={12} color="#8E8E93" />{" "}
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
          <Ionicons name="document-outline" size={48} color="#D1D5DB" />
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
    paddingHorizontal: 20,
    marginBottom: 24,
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
    color: "#111827",
    letterSpacing: -0.3,
  },
  viewAllText: {
    fontSize: 14,
    color: "#0B5ED7",
    fontWeight: "700",
  },
  scanCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  scanHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  scanId: {
    fontSize: 12,
    color: "#0B5ED7",
    fontWeight: "700",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  resultBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  resultDanger: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
  },
  resultSafe: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
  },
  resultText: {
    fontSize: 12,
    fontWeight: "700",
  },
  resultTextDanger: {
    color: "#EF4444",
  },
  resultTextSafe: {
    color: "#10B981",
  },
  scanFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  scanDate: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  scanConfidence: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111827",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginTop: 12,
    marginBottom: 4,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
  },
});
