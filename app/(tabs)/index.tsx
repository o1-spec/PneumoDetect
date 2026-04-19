import { Ionicons } from "@expo/vector-icons";
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
import { AuthContext } from "../../hooks/useAuth";
import {
  analyticsAPI,
  notificationsAPI,
  scansAPI,
} from "../../services/api.client";
import { AnalyticsStats, Scan } from "../../types/api";

const screenWidth = Dimensions.get("window").width;

export default function DashboardScreen() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [recentScans, setRecentScans] = useState<Scan[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
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
      const [analyticsData, scansData, notificationsData] = await Promise.all([
        analyticsAPI.getStats(),
        scansAPI.getAll(),
        notificationsAPI.getAll(),
      ]);

      setStats(analyticsData);
      const recent = Array.isArray(scansData) ? scansData.slice(0, 3) : [];
      setRecentScans(recent);

      const unreadCount = Array.isArray(notificationsData)
        ? notificationsData.filter((n) => !n.read).length
        : 0;
      setNotificationCount(unreadCount);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      setStats(null);
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

  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [12, 15, 18, 14, 20, 16, 8],
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
          <Text style={styles.loadingText}>Loading dashboard...</Text>
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
        <View style={styles.welcomeCard}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>{userDisplayName}</Text>
          </View>
          <View style={styles.iconContainer}>
            <Ionicons name="medical" size={40} color="#0066CC" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push("/analysis/upload")}
            >
              <View style={[styles.actionIcon, styles.primaryBg]}>
                <Ionicons name="add-circle" size={32} color="#FFFFFF" />
              </View>
              <Text style={styles.actionText}>New Scan</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push("/(tabs)/history")}
            >
              <View style={[styles.actionIcon, styles.secondaryBg]}>
                <Ionicons name="time" size={32} color="#FFFFFF" />
              </View>
              <Text style={styles.actionText}>History</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push("/(tabs)/(admin)/all-scans")}
            >
              <View style={[styles.actionIcon, styles.tertiaryBg]}>
                <Ionicons name="analytics" size={32} color="#FFFFFF" />
              </View>
              <Text style={styles.actionText}>Analytics</Text>
            </TouchableOpacity>

            {isAdmin && (
              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => router.push("/(tabs)/(admin)/users")}
              >
                <View style={[styles.actionIcon, styles.quaternaryBg]}>
                  <Ionicons name="people" size={32} color="#FFFFFF" />
                </View>
                <Text style={styles.actionText}>Users</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, styles.totalCard]}>
              <Ionicons name="document-text" size={24} color="#0066CC" />
              <Text style={styles.statValue}>{stats?.totalScans || 0}</Text>
              <Text style={styles.statLabel}>Total Scans</Text>
            </View>

            <View style={[styles.statCard, styles.dangerCard]}>
              <Ionicons name="warning" size={24} color="#D32F2F" />
              <Text style={[styles.statValue, styles.dangerText]}>
                {stats?.failedScans || 0}
              </Text>
              <Text style={styles.statLabel}>Failed</Text>
            </View>

            <View style={[styles.statCard, styles.safeCard]}>
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
              <Text style={[styles.statValue, styles.safeText]}>
                {stats?.completedScans || 0}
              </Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>

            <View style={[styles.statCard, styles.accuracyCard]}>
              <Ionicons name="time" size={24} color="#FF9800" />
              <Text style={[styles.statValue, styles.accuracyText]}>
                {stats?.processingScans || 0}
              </Text>
              <Text style={styles.statLabel}>Processing</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Activity</Text>
          <View style={styles.chartCard}>
            <LineChart
              data={chartData}
              width={screenWidth - 48}
              height={220}
              chartConfig={{
                backgroundColor: "#FFFFFF",
                backgroundGradientFrom: "#FFFFFF",
                backgroundGradientTo: "#FFFFFF",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 102, 204, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(28, 28, 30, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#0066CC",
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
              <Text style={styles.chartSubtext}>↑ 12.5% vs last week</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Scans</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/history")}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {recentScans.map((scan) => (
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
                  <Ionicons name="calendar-outline" size={12} color="#8E8E93" />{" "}
                  {new Date(scan.createdAt).toLocaleDateString()}
                </Text>
                <Text style={styles.scanConfidence}>
                  {scan.confidence || 0}% confidence
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Status</Text>
          <View style={styles.statusCard}>
            <View style={styles.statusRow}>
              <View style={styles.statusIndicator}>
                <View style={[styles.statusDot, styles.statusActive]} />
                <Text style={styles.statusText}>AI Model</Text>
              </View>
              <Text style={styles.statusValue}>Operational</Text>
            </View>
            <View style={styles.statusRow}>
              <View style={styles.statusIndicator}>
                <View style={[styles.statusDot, styles.statusActive]} />
                <Text style={styles.statusText}>Database</Text>
              </View>
              <Text style={styles.statusValue}>Connected</Text>
            </View>
            <View style={styles.statusRow}>
              <View style={styles.statusIndicator}>
                <View style={[styles.statusDot, styles.statusActive]} />
                <Text style={styles.statusText}>Storage</Text>
              </View>
              <Text style={styles.statusValue}>78% Used</Text>
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
    backgroundColor: "#F5F5F7",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 2,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F5F5F7",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "#D32F2F",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
  },
  welcomeCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    margin: 16,
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
  },
  welcomeText: {
    fontSize: 14,
    color: "#0066CC",
    marginBottom: 4,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0066CC",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    paddingHorizontal: 16,
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
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 14,
    color: "#0066CC",
    fontWeight: "600",
  },
  quickActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  primaryBg: {
    backgroundColor: "#0066CC",
  },
  secondaryBg: {
    backgroundColor: "#4CAF50",
  },
  tertiaryBg: {
    backgroundColor: "#FF9800",
  },
  quaternaryBg: {
    backgroundColor: "#9C27B0",
  },
  actionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1C1C1E",
    textAlign: "center",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    width: (screenWidth - 44) / 2,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  totalCard: {
    backgroundColor: "#E3F2FD",
  },
  dangerCard: {
    backgroundColor: "#FFEBEE",
  },
  safeCard: {
    backgroundColor: "#E8F5E9",
  },
  accuracyCard: {
    backgroundColor: "#FFF3E0",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginVertical: 8,
  },
  dangerText: {
    color: "#D32F2F",
  },
  safeText: {
    color: "#4CAF50",
  },
  accuracyText: {
    color: "#FF9800",
  },
  statLabel: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "600",
  },
  chartCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  chartFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
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
    backgroundColor: "#0066CC",
  },
  legendText: {
    fontSize: 12,
    color: "#8E8E93",
  },
  chartSubtext: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "600",
  },
  scanCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    color: "#0066CC",
    fontWeight: "600",
    marginBottom: 4,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  resultBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  resultDanger: {
    backgroundColor: "#FFEBEE",
  },
  resultSafe: {
    backgroundColor: "#E8F5E9",
  },
  resultText: {
    fontSize: 12,
    fontWeight: "600",
  },
  resultTextDanger: {
    color: "#D32F2F",
  },
  resultTextSafe: {
    color: "#4CAF50",
  },
  scanFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F5F5F7",
  },
  scanDate: {
    fontSize: 12,
    color: "#8E8E93",
  },
  scanConfidence: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  statusCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F7",
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusActive: {
    backgroundColor: "#4CAF50",
  },
  statusText: {
    fontSize: 14,
    color: "#1C1C1E",
    fontWeight: "600",
  },
  statusValue: {
    fontSize: 14,
    color: "#8E8E93",
  },
  bottomSpacer: {
    height: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#8E8E93",
    marginTop: 8,
  },
});
