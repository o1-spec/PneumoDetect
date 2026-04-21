import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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
import { Card, SectionHeader, StatCard, PneumoLoader } from "../../components/premium";
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
      const response = await scansAPI.getMyScans();
      const scans = response.scans || [];

      setRecentScans(scans.slice(0, 5));

      const normal = scans.filter((s: any) => s.result === "NORMAL").length;
      const concerns = scans.filter(
        (s: any) => s.result === "PNEUMONIA" || s.result === "CONCERNS"
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
            <Text style={styles.headerTitle}>Dashboard</Text>
            <Text style={styles.headerSubtitle}>Track your health updates</Text>
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
        <LinearGradient
          colors={["#0B5ED7", "#0B5ED7", "#1E6FDD"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.welcomeGradient}
        >
          <View style={styles.welcomeContent}>
            <View style={styles.welcomeTextContainer}>
              <Text style={styles.welcomeGreeting}>Welcome back!</Text>
              <Text style={styles.welcomeName}>{user?.name || "Patient"}</Text>
              <Text style={styles.welcomeSubtext}>Your health summary</Text>
            </View>
            <View style={styles.welcomeIconCircle}>
              <Ionicons name="person" size={48} color="#FFFFFF" />
            </View>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <SectionHeader title="Your Activity" subtitle="Scan statistics" />
          <View style={styles.statsContainer}>
            <View style={styles.statRow}>
              <View style={{ flex: 1 }}>
                <StatCard
                  icon="document-text-outline"
                  title="Total Scans"
                  value={stats.totalScans}
                  color="#0B5ED7"
                  backgroundColor="rgba(11, 94, 215, 0.08)"
                />
              </View>
              <View style={{ flex: 1 }}>
                <StatCard
                  icon="checkmark-circle-outline"
                  title="Normal"
                  value={stats.normalScans}
                  color="#10B981"
                  backgroundColor="rgba(16, 185, 129, 0.08)"
                />
              </View>
            </View>
            <View style={styles.statRow}>
              <View style={{ flex: 1 }}>
                <StatCard
                  icon="alert-circle-outline"
                  title="Concerns"
                  value={stats.pneumoniaScans}
                  color="#EF4444"
                  backgroundColor="rgba(239, 68, 68, 0.08)"
                />
              </View>
              <View style={{ flex: 1 }} />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Scans</Text>
            <TouchableOpacity
              onPress={() => router.push("/(patient)/my-scans")}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <PneumoLoader size={48} color="#0B5ED7" style={{ marginTop: 20 }} />
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
                      <Text style={styles.scanId}>{scan.id}</Text>
                      <Text style={styles.scanPatient}>
                        {scan.doctorName || "Analyzed"}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.resultBadge,
                        scan.result === "NORMAL"
                          ? styles.resultSafe
                          : styles.resultDanger,
                      ]}
                    >
                      <Text
                        style={[
                          styles.resultText,
                          scan.result === "NORMAL"
                            ? styles.resultTextSafe
                            : styles.resultTextDanger,
                        ]}
                      >
                        {scan.result || "PENDING"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.scanFooter}>
                    <Text style={styles.scanDate}>
                      <Ionicons
                        name="calendar-outline"
                        size={12}
                        color="#8E8E93"
                      />{" "}
                      {new Date(scan.createdAt).toLocaleDateString()}
                    </Text>
                    <Text style={styles.scanConfidence}>
                      {scan.confidence
                        ? `${Math.round(scan.confidence * 100)}% confidence`
                        : "N/A confidence"}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="document-outline" size={48} color="#D1D5DB" />
              <Text style={styles.emptyText}>No scans yet</Text>
              <Text style={styles.emptySubtext}>
                Your scan results will appear here
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Important Notes</Text>
          <Card elevated="light" backgroundColor="rgba(11, 94, 215, 0.08)">
            <View style={styles.infoContent}>
              <Ionicons name="information-circle" size={24} color="#0B5ED7" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoTitle}>Always Consult a Doctor</Text>
                <Text style={styles.infoText}>
                  This AI analysis is not a medical diagnosis. Always consult
                  with a qualified healthcare professional for medical advice.
                </Text>
              </View>
            </View>
          </Card>
        </View>
        <View style={styles.bottomSpacer} />
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
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
    fontWeight: "500",
  },
  content: {
    flex: 1,
  },
  welcomeGradient: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 24,
    borderRadius: 16,
    padding: 24,
    shadowColor: "#0B5ED7",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  welcomeContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  welcomeGreeting: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  welcomeName: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  welcomeSubtext: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.85)",
  },
  welcomeIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
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
  statsContainer: {
    gap: 12,
  },
  statRow: {
    flexDirection: "row",
    gap: 12,
  },
  scansList: {
    gap: 12,
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
  scanInfo: {
    flex: 1,
  },
  scanId: {
    fontSize: 12,
    color: "#0B5ED7",
    fontWeight: "700",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  scanPatient: {
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
  resultTextSafe: {
    color: "#10B981",
  },
  resultTextDanger: {
    color: "#EF4444",
  },
  scanFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 12,
  },
  scanDate: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  scanConfidence: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
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
  infoContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0B5ED7",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: "#1E3A8A",
    lineHeight: 20,
    fontWeight: "500",
  },
  bottomSpacer: {
    height: 40,
  },
});
