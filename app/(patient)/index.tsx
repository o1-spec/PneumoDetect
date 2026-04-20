import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { AuthContext } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { scansAPI } from "../../services/api.client";
import type { Scan } from "../../types/api";
import { getErrorMessage } from "../../utils/errorHandler";

export default function PatientDashboardScreen() {
  const authContext = useContext(AuthContext);
  const { error: showError } = useToast();
  const [recentScans, setRecentScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalScans: 0,
    normalScans: 0,
    pneumoniaScans: 0,
  });

  if (!authContext) {
    return <Text>Auth context not available</Text>;
  }

  const { user } = authContext;

  useEffect(() => {
    loadScans();
  }, []);

  const loadScans = async () => {
    try {
      setLoading(true);
      // Use patient-specific endpoint that returns scans with patient-safe fields
      const response = await scansAPI.getMyScans();
      const scans = response.scans || [];

      setRecentScans(scans.slice(0, 5));

      // Calculate statistics
      const normal = scans.filter((s: any) => s.result === "NORMAL").length;
      const concerns = scans.filter(
        (s: any) =>
          s.result === "PNEUMONIA_DETECTED" || s.result === "CONCERNS",
      ).length;

      setStats({
        totalScans: scans.length,
        normalScans: normal,
        pneumoniaScans: concerns,
      });
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
          <View>
            <Text style={styles.headerTitle}>Welcome Back</Text>
            <Text style={styles.headerSubtitle}>{user?.name || "Patient"}</Text>
          </View>
          <View style={styles.headerIcon}>
            <Ionicons name="person-circle" size={56} color="#0066CC" />
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, styles.totalCard]}>
            <View style={styles.statIconContainer}>
              <Ionicons name="images" size={28} color="#0066CC" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Total Scans</Text>
              <Text style={styles.statValue}>{stats.totalScans}</Text>
            </View>
          </View>

          <View style={[styles.statCard, styles.normalCard]}>
            <View style={styles.statIconContainer}>
              <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Normal</Text>
              <Text style={styles.statValue}>{stats.normalScans}</Text>
            </View>
          </View>

          <View style={[styles.statCard, styles.pneumoniaCard]}>
            <View style={styles.statIconContainer}>
              <Ionicons name="alert-circle" size={28} color="#FF9800" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Concerns</Text>
              <Text style={styles.statValue}>{stats.pneumoniaScans}</Text>
            </View>
          </View>
        </View>

        {/* Recent Scans */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Scans</Text>
            <TouchableOpacity
              onPress={() => router.push("/(patient)/my-scans")}
            >
              <Text style={styles.viewAllLink}>View All</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator
              size="large"
              color="#0066CC"
              style={{ marginTop: 20 }}
            />
          ) : recentScans.length > 0 ? (
            <View style={styles.scansList}>
              {recentScans.map((scan) => (
                <TouchableOpacity
                  key={scan.id}
                  style={styles.scanCard}
                  onPress={() => navigateToScan(scan.id)}
                >
                  <View style={styles.scanHeader}>
                    <View style={styles.scanInfo}>
                      <Text style={styles.scanDate}>
                        {new Date(scan.createdAt).toLocaleDateString()}
                      </Text>
                      <Text style={styles.scanPatient}>
                        {scan.doctorName || "Analyzed"}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.resultBadge,
                        scan.result === "NORMAL"
                          ? styles.resultNormal
                          : styles.resultPneumonia,
                      ]}
                    >
                      <Text
                        style={[
                          styles.resultText,
                          scan.result === "NORMAL"
                            ? styles.resultTextNormal
                            : styles.resultTextPneumonia,
                        ]}
                      >
                        {scan.result || "PENDING"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.scanDetails}>
                    <View style={styles.detailItem}>
                      <Ionicons name="trending-up" size={16} color="#8E8E93" />
                      <Text style={styles.detailText}>
                        Confidence:{" "}
                        {scan.confidence
                          ? Math.round(scan.confidence * 100)
                          : "N/A"}
                        %
                      </Text>
                    </View>
                    {scan.status === "COMPLETED" && (
                      <View style={styles.detailItem}>
                        <Ionicons
                          name="checkmark-circle"
                          size={16}
                          color="#4CAF50"
                        />
                        <Text style={styles.detailText}>Analysis Complete</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="document-outline" size={48} color="#D0D0D0" />
              <Text style={styles.emptyText}>No scans yet</Text>
              <Text style={styles.emptySubtext}>
                Your scan results will appear here
              </Text>
            </View>
          )}
        </View>

        {/* Quick Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Important Notes</Text>
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={24} color="#0066CC" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Always Consult a Doctor</Text>
              <Text style={styles.infoText}>
                This AI analysis is not a medical diagnosis. Always consult with
                a qualified healthcare professional for medical advice.
              </Text>
            </View>
          </View>
        </View>
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
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 4,
  },
  headerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsContainer: {
    flexDirection: "row",
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  totalCard: {
    backgroundColor: "#E3F2FD",
  },
  normalCard: {
    backgroundColor: "#E8F5E9",
  },
  pneumoniaCard: {
    backgroundColor: "#FFF3E0",
  },
  statIconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: "#8E8E93",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  viewAllLink: {
    fontSize: 14,
    color: "#0066CC",
    fontWeight: "600",
  },
  scansList: {
    gap: 12,
  },
  scanCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  scanHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  scanInfo: {
    flex: 1,
  },
  scanDate: {
    fontSize: 12,
    color: "#8E8E93",
  },
  scanPatient: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    marginTop: 4,
  },
  resultBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  resultNormal: {
    backgroundColor: "#E8F5E9",
  },
  resultPneumonia: {
    backgroundColor: "#FFF3E0",
  },
  resultText: {
    fontSize: 12,
    fontWeight: "600",
  },
  resultTextNormal: {
    color: "#4CAF50",
  },
  resultTextPneumonia: {
    color: "#FF9800",
  },
  scanDetails: {
    flexDirection: "row",
    gap: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    color: "#8E8E93",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: "#E3F2FD",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0066CC",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: "#555555",
    lineHeight: 18,
  },
});
