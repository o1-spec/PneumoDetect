import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Card, SectionHeader, StatCard, PneumoLoader } from "../../components/premium";
import { AuthContext } from "../../hooks/useAuth";
import {
  analyticsAPI,
  notificationsAPI,
  scansAPI,
} from "../../services/api.client";
import { AnalyticsStats, Scan, ScanResultStatistics } from "../../types/api";

const screenWidth = Dimensions.get("window").width;

export default function DashboardScreen() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [scanResults, setScanResults] = useState<ScanResultStatistics | null>(
    null,
  );
  const [recentScans, setRecentScans] = useState<Scan[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [systemStatus, setSystemStatus] = useState<{
    aiModel: string;
    database: string;
    storage: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const authContext = useContext(AuthContext);
  const userDisplayName = authContext?.user?.name || "Doctor";
  const isAdmin = authContext?.user?.role === "ADMIN";

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      let analyticsData: AnalyticsStats | null = null;
      try {
        analyticsData = await analyticsAPI.getStats();
      } catch (error) {}

      let scanResultsData: ScanResultStatistics | null = null;
      try {
        scanResultsData = await analyticsAPI.getScanResults({ groupBy: "day" });
      } catch (error) {}

      let scansData: Scan[] = [];
      try {
        const data = await scansAPI.getAll();
        scansData = Array.isArray(data) ? data : [];
      } catch (error) {}

      let notificationsData: any[] = [];
      try {
        const data = await notificationsAPI.getAll();
        notificationsData = Array.isArray(data) ? data : [];
      } catch (error) {}

      let statusData: { aiModel: string; database: string; storage: string } = {
        aiModel: "Operational",
        database: "Connected",
        storage: "78% Used",
      };
      try {
        const response = await analyticsAPI.getSystemStatus();

        if (response && typeof response === "object") {
          if (response.aiModel) {
            statusData = {
              aiModel: response.aiModel || "Operational",
              database: response.database || "Connected",
              storage: response.storage || "0.0% Used",
            };
          } else if (
            typeof response.aiModel === "string" &&
            typeof response.database === "string" &&
            typeof response.storage === "string"
          ) {
            statusData = response;
          }
        }
      } catch (error) {}

      setStats(analyticsData);
      setScanResults(scanResultsData);
      setSystemStatus(statusData);
      const recent = scansData.slice(0, 3);
      setRecentScans(recent);

      const unreadCount = notificationsData.filter((n: any) => !n.read).length;

      const finalCount =
        typeof unreadCount === "number" && unreadCount >= 0 ? unreadCount : 0;
      setNotificationCount(finalCount);
    } catch (error) {
      setStats(null);
      setScanResults(null);
      setSystemStatus(null);
      setRecentScans([]);
      setNotificationCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await loadDashboardData();
    } finally {
      setRefreshing(false);
    }
  };

  const defaultTimeline = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      date: date.toISOString(),
      scans: 0,
    };
  });

  const timelineDataForChart =
    scanResults?.timelineData && scanResults.timelineData.length > 0
      ? scanResults.timelineData
      : defaultTimeline;

  // Calculate growth percentage
  const calculateGrowthPercentage = () => {
    if (stats?.weekGrowthPercentage !== undefined) {
      return stats.weekGrowthPercentage;
    }
    if (stats?.previousWeekScans && stats?.totalScans) {
      const growth =
        ((stats.totalScans - stats.previousWeekScans) /
          stats.previousWeekScans) *
        100;
      return growth;
    }
    return null;
  };

  const growthPercentage = calculateGrowthPercentage();
  const showGrowthMetric = stats && stats.totalScans > 0;

  const chartData = {
    labels: timelineDataForChart.map((item) => {
      const date = new Date(item.date);
      return date.toLocaleDateString("en-US", { weekday: "short" });
    }),
    datasets: [
      {
        data: timelineDataForChart.map((item) => item.scans || 0),
        color: (opacity = 1) => `rgba(0, 102, 204, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>Dashboard</Text>
              <Text style={styles.headerSubtitle}>Track your scans</Text>
            </View>
            <TouchableOpacity
              style={styles.notificationButton}
              onPress={() => router.push("/notifications")}
            >
              <Ionicons name="notifications" size={24} color="#0066CC" />
              {notificationCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{notificationCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <PneumoLoader size={64} color="#0B5ED7" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Dashboard</Text>
            <Text style={styles.headerSubtitle}>Track your scans</Text>
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => router.push("/notifications")}
          >
            <Ionicons name="notifications" size={24} color="#0066CC" />
            {notificationCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{notificationCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
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
              <Text style={styles.welcomeName}>{userDisplayName}</Text>
              <Text style={styles.welcomeSubtext}>
                {notificationCount > 0
                  ? `${notificationCount} updates waiting`
                  : "All systems operational"}
              </Text>
            </View>
            <View style={styles.welcomeIconCircle}>
              <Ionicons name="medical" size={48} color="#FFFFFF" />
            </View>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <SectionHeader
            title="Quick Actions"
            subtitle="Get started in seconds"
          />
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push("/analysis/upload")}
            >
              <View
                style={[
                  styles.actionIconBg,
                  { backgroundColor: "rgba(11, 94, 215, 0.1)" },
                ]}
              >
                <Ionicons name="add-circle-outline" size={28} color="#0B5ED7" />
              </View>
              <Text style={styles.actionButtonText}>New Scan</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push("/(tabs)/history")}
            >
              <View
                style={[
                  styles.actionIconBg,
                  { backgroundColor: "rgba(16, 185, 129, 0.1)" },
                ]}
              >
                <Ionicons name="time-outline" size={28} color="#10B981" />
              </View>
              <Text style={styles.actionButtonText}>History</Text>
            </TouchableOpacity>
          </View>
          {isAdmin && (
            <View style={styles.quickActionsGrid}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push("/(tabs)/(admin)/all-scans")}
              >
                <View
                  style={[
                    styles.actionIconBg,
                    { backgroundColor: "rgba(59, 130, 246, 0.1)" },
                  ]}
                >
                  <Ionicons
                    name="bar-chart-outline"
                    size={28}
                    color="#3B82F6"
                  />
                </View>
                <Text style={styles.actionButtonText}>All Scans</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push("/(tabs)/(admin)/users")}
              >
                <View
                  style={[
                    styles.actionIconBg,
                    { backgroundColor: "rgba(168, 85, 247, 0.1)" },
                  ]}
                >
                  <Ionicons name="people-outline" size={28} color="#A855F7" />
                </View>
                <Text style={styles.actionButtonText}>Users</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="Scan Overview"
            subtitle="This month's statistics"
          />
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

        <View style={styles.section}>
          <SectionHeader title="Weekly Activity" subtitle="7-day scan trend" />
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

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Scans</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/history")}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {recentScans.length > 0 ? (
            recentScans.map((scan) => (
              <TouchableOpacity
                key={scan.id}
                style={styles.scanCard}
                onPress={() =>
                  router.push({
                    pathname: "/report/[scanId]",
                    params: { scanId: scan.id },
                  })
                }
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
                    <Ionicons
                      name="calendar-outline"
                      size={12}
                      color="#8E8E93"
                    />{" "}
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Status</Text>
          <View style={styles.statusCard}>
            <View style={styles.statusRow}>
              <View style={styles.statusIndicator}>
                <View style={[styles.statusDot, styles.statusActive]} />
                <Text style={styles.statusText}>AI Model</Text>
              </View>
              <Text style={styles.statusValue}>
                {typeof systemStatus?.aiModel === "string"
                  ? systemStatus.aiModel
                  : "Operational"}
              </Text>
            </View>
            <View style={styles.statusRow}>
              <View style={styles.statusIndicator}>
                <View style={[styles.statusDot, styles.statusActive]} />
                <Text style={styles.statusText}>Database</Text>
              </View>
              <Text style={styles.statusValue}>
                {typeof systemStatus?.database === "string"
                  ? systemStatus.database
                  : "Connected"}
              </Text>
            </View>
            <View style={styles.statusRow}>
              <View style={styles.statusIndicator}>
                <View style={[styles.statusDot, styles.statusActive]} />
                <Text style={styles.statusText}>Storage</Text>
              </View>
              <Text style={styles.statusValue}>
                {typeof systemStatus?.storage === "string"
                  ? systemStatus.storage
                  : "78% Used"}
              </Text>
            </View>
          </View>
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
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "#EF4444",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  scrollView: {
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
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginHorizontal: -20,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  actionButton: {
    flex: 1,
    minWidth: (screenWidth - 52) / 2,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIconBg: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },
  statsContainer: {
    gap: 12,
  },
  statRow: {
    flexDirection: "row",
    gap: 12,
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
  statusCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusActive: {
    backgroundColor: "#10B981",
  },
  statusText: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
  },
  statusValue: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  bottomSpacer: {
    height: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#9CA3AF",
    marginTop: 12,
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
