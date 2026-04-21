import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PremiumChip } from "../../components/premium";
import { useToast } from "../../hooks/useToast";
import { scansAPI } from "../../services/api.client";
import type { Scan } from "../../types/api";
import { getErrorMessage } from "../../utils/errorHandler";

export default function PatientMyScansScreen() {
  const { error: showError } = useToast();
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<"ALL" | "NORMAL" | "PNEUMONIA">("ALL");

  useEffect(() => {
    loadScans();
  }, []);

  const loadScans = async () => {
    try {
      setLoading(true);
      const response = await scansAPI.getMyScans();
      const scans = response.scans || [];
      setScans(scans);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadScans();
    setRefreshing(false);
  };

  const filteredScans = scans.filter((scan: Scan) => {
    if (filter === "NORMAL") return scan.result === "NORMAL";
    if (filter === "PNEUMONIA")
      return scan.result === "PNEUMONIA" || scan.result === "CONCERNS";
    return true;
  });

  const navigateToScan = (scanId: string) => {
    router.push({
      pathname: "/(patient)/scan-details",
      params: { scanId },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#0B5ED7" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Scans</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      <View style={styles.filterContainer}>
        <PremiumChip
          label={`All (${scans.length})`}
          selected={filter === "ALL"}
          onPress={() => setFilter("ALL")}
        />
        <PremiumChip
          label={`Normal (${scans.filter((s) => s.result === "NORMAL").length})`}
          selected={filter === "NORMAL"}
          onPress={() => setFilter("NORMAL")}
        />
        <PremiumChip
          label={`Concerns (${
            scans.filter(
              (s) => s.result === "PNEUMONIA" || s.result === "CONCERNS"
            ).length
          })`}
          selected={filter === "PNEUMONIA"}
          onPress={() => setFilter("PNEUMONIA")}
        />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#0B5ED7"
            style={{ marginTop: 40 }}
          />
        ) : filteredScans.length > 0 ? (
          <View style={styles.scansList}>
            {filteredScans.map((scan) => (
              <TouchableOpacity
                key={scan.id}
                style={styles.scanCard}
                onPress={() => navigateToScan(scan.id)}
              >
                <View style={styles.scanCardLeft}>
                  <View
                    style={[
                      styles.statusIndicator,
                      scan.result === "NORMAL"
                        ? styles.statusNormal
                        : styles.statusConcern,
                    ]}
                  />
                  <View style={styles.scanInfo}>
                    <Text style={styles.scanDate}>
                      {new Date(scan.createdAt).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Text>
                    <Text style={styles.scanTime}>
                      {new Date(scan.createdAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                    {scan.doctorName && (
                      <Text style={styles.patientName}>
                        Analyzed by {scan.doctorName}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={styles.scanCardRight}>
                  <View
                    style={[
                      styles.resultBadge,
                      scan.result === "NORMAL"
                        ? styles.resultNormalBg
                        : styles.resultConcernBg,
                    ]}
                  >
                    <Text
                      style={[
                        styles.resultBadgeText,
                        scan.result === "NORMAL"
                          ? styles.resultNormalText
                          : styles.resultConcernText,
                      ]}
                    >
                      {scan.result}
                    </Text>
                  </View>

                  <View style={styles.confidenceContainer}>
                    <Text style={styles.confidenceLabel}>Confidence</Text>
                    <Text style={styles.confidenceValue}>
                      {scan.confidence
                        ? `${Math.round(scan.confidence * 100)}%`
                        : "N/A"}
                    </Text>
                  </View>

                  <Ionicons name="chevron-forward" size={24} color="#D1D5DB" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="images-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyText}>No scans found</Text>
            <Text style={styles.emptySubtext}>
              {filter === "ALL"
                ? "Your scans will appear here"
                : `No ${filter.toLowerCase()} scans found`}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFBFC",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.3,
  },
  filterContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    gap: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scansList: {
    gap: 12,
  },
  scanCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  scanCardLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusNormal: {
    backgroundColor: "#10B981",
  },
  statusConcern: {
    backgroundColor: "#EF4444",
  },
  scanInfo: {
    flex: 1,
  },
  scanDate: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  scanTime: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
    fontWeight: "500",
  },
  patientName: {
    fontSize: 13,
    color: "#4B5563",
    marginTop: 4,
    fontWeight: "500",
  },
  scanCardRight: {
    alignItems: "flex-end",
    gap: 8,
  },
  resultBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  resultNormalBg: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
  },
  resultConcernBg: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
  },
  resultBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  resultNormalText: {
    color: "#10B981",
  },
  resultConcernText: {
    color: "#EF4444",
  },
  confidenceContainer: {
    alignItems: "flex-end",
  },
  confidenceLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  confidenceValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
    marginTop: 2,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
    fontWeight: "500",
  },
});
