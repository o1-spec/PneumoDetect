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
import {
  QuickActions,
  RecentScans,
  ScanOverview,
  SystemStatusCard,
  WeeklyActivity,
  WelcomeBanner,
} from "../../components/dashboard";
import { PneumoLoader } from "../../components/premium/PneumoLoader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthContext } from "../../hooks/useAuth";
import {
  analyticsAPI,
  notificationsAPI,
  scansAPI,
} from "../../services/api.client";
import { AnalyticsStats, Scan, ScanResultStatistics } from "../../types/api";

const screenWidth = Dimensions.get("window").width;

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
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
        <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top + 8 : 16 }]}>
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
      <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top + 8 : 16 }]}>
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
        <WelcomeBanner
          userDisplayName={userDisplayName}
          notificationCount={notificationCount}
        />
        <QuickActions isAdmin={isAdmin} />
        <ScanOverview stats={stats} growthPercentage={growthPercentage} />
        <WeeklyActivity
          chartData={chartData}
          growthPercentage={growthPercentage}
          showGrowthMetric={showGrowthMetric}
        />
        <RecentScans recentScans={recentScans} />

        <SystemStatusCard systemStatus={systemStatus} />

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
  bottomSpacer: {
    height: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
