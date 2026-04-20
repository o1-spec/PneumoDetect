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
      // Use patient-specific endpoint
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
      return scan.result === "PNEUMONIA_DETECTED" || scan.result === "CONCERNS";
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
        <Text style={styles.title}>My Scans</Text>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "ALL" && styles.filterButtonActive,
          ]}
          onPress={() => setFilter("ALL")}
        >
          <Text
            style={[
              styles.filterButtonText,
              filter === "ALL" && styles.filterButtonTextActive,
            ]}
          >
            All ({scans.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "NORMAL" && styles.filterButtonActive,
          ]}
          onPress={() => setFilter("NORMAL")}
        >
          <Text
            style={[
              styles.filterButtonText,
              filter === "NORMAL" && styles.filterButtonTextActive,
            ]}
          >
            Normal ({scans.filter((s) => s.result === "NORMAL").length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "PNEUMONIA" && styles.filterButtonActive,
          ]}
          onPress={() => setFilter("PNEUMONIA")}
        >
          <Text
            style={[
              styles.filterButtonText,
              filter === "PNEUMONIA" && styles.filterButtonTextActive,
            ]}
          >
            Concerns ({scans.filter((s) => s.result === "PNEUMONIA").length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Scans List */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#0066CC"
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
                    {scan.patient && (
                      <Text style={styles.patientName}>
                        Patient: {scan.patient.name}
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

                  <Ionicons name="chevron-forward" size={24} color="#D0D0D0" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="images-outline" size={64} color="#D0D0D0" />
            <Text style={styles.emptyText}>No scans found</Text>
            <Text style={styles.emptySubtext}>
              {filter === "ALL"
                ? "Your scans will appear here"
                : `No ${filter.toLowerCase()} scans found`}
            </Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F7",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  filterContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F5F5F7",
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  filterButtonActive: {
    backgroundColor: "#0066CC",
    borderColor: "#0066CC",
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8E8E93",
  },
  filterButtonTextActive: {
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  scansList: {
    gap: 12,
  },
  scanCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
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
    backgroundColor: "#4CAF50",
  },
  statusConcern: {
    backgroundColor: "#FF9800",
  },
  scanInfo: {
    flex: 1,
  },
  scanDate: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  scanTime: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 2,
  },
  patientName: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 4,
  },
  scanCardRight: {
    alignItems: "flex-end",
    gap: 8,
  },
  resultBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  resultNormalBg: {
    backgroundColor: "#E8F5E9",
  },
  resultConcernBg: {
    backgroundColor: "#FFF3E0",
  },
  resultBadgeText: {
    fontSize: 11,
    fontWeight: "bold",
  },
  resultNormalText: {
    color: "#4CAF50",
  },
  resultConcernText: {
    color: "#FF9800",
  },
  confidenceContainer: {
    alignItems: "flex-end",
  },
  confidenceLabel: {
    fontSize: 11,
    color: "#8E8E93",
  },
  confidenceValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginTop: 2,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 4,
  },
});
