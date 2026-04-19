import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { analyticsAPI } from "../../../services/api.client";
import {
    DashboardMetrics,
    PatientAnalytics,
    ScanResultStatistics,
} from "../../../types/api";
import { formatDate } from "../../../utils/dateFormatter";

const screenWidth = Dimensions.get("window").width;

export default function AnalyticsScreen() {
  const [dashboardData, setDashboardData] = useState<DashboardMetrics | null>(
    null,
  );
  const [scanResults, setScanResults] = useState<ScanResultStatistics | null>(
    null,
  );
  const [patientAnalytics, setPatientAnalytics] =
    useState<PatientAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "scans" | "patients"
  >("dashboard");

  useFocusEffect(
    useCallback(() => {
      loadAnalytics();
    }, []),
  );

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [dashboard, scans, patients] = await Promise.all([
        analyticsAPI.getDashboard(),
        analyticsAPI.getScanResults({ groupBy: "day" }),
        analyticsAPI.getPatientAnalytics(),
      ]);

      setDashboardData(dashboard);
      setScanResults(scans);
      setPatientAnalytics(patients);
    } catch (error) {
      console.error("Error loading analytics:", error);
      Alert.alert("Error", "Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await loadAnalytics();
    } catch (error) {
      console.error("Error refreshing analytics:", error);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#0066CC" />
        <Text style={styles.loadingText}>Loading analytics...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#0066CC" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Analytics</Text>
            <Text style={styles.headerSubtitle}>Platform insights</Text>
          </View>
          <View style={styles.placeholder} />
        </View>
      </View>

      <View style={styles.tabContainer}>
        {(["dashboard", "scans", "patients"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {activeTab === "dashboard" && dashboardData && (
          <DashboardTab data={dashboardData} />
        )}
        {activeTab === "scans" && scanResults && (
          <ScansTab data={scanResults} />
        )}
        {activeTab === "patients" && patientAnalytics && (
          <PatientsTab data={patientAnalytics} />
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

function DashboardTab({ data }: { data: DashboardMetrics }) {
  return (
    <View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Metrics</Text>
        <View style={styles.metricsGrid}>
          <MetricCard
            label="Total Scans"
            value={data.totalScans.toString()}
            icon="scan"
            color="#0066CC"
          />
          <MetricCard
            label="Patients"
            value={data.totalPatients.toString()}
            icon="people"
            color="#4CAF50"
          />
          <MetricCard
            label="Pneumonia"
            value={data.pneumoniaDetected.toString()}
            icon="warning"
            color="#D32F2F"
          />
          <MetricCard
            label="Accuracy"
            value={`${(data.accuracyRate * 100).toFixed(1)}%`}
            icon="checkmark-circle"
            color="#FF9800"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Metrics</Text>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Scans: </Text>
          <Text style={styles.metricValue}>{data.todayMetrics.scans}</Text>
          <Text style={styles.metricLabel}>Pneumonia: </Text>
          <Text style={styles.metricValue}>{data.todayMetrics.pneumonia}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>This Week</Text>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Scans: </Text>
          <Text style={styles.metricValue}>{data.thisWeekMetrics.scans}</Text>
          <Text style={styles.metricLabel}>Pneumonia: </Text>
          <Text style={styles.metricValue}>
            {data.thisWeekMetrics.pneumonia}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Patients</Text>
        {data.topPatients.map((patient, index) => (
          <View key={index} style={styles.patientRow}>
            <View style={styles.patientInfo}>
              <Text style={styles.patientName}>{patient.name}</Text>
              <Text style={styles.patientStats}>
                {patient.scanCount} scans • {patient.pneumoniaDetected}{" "}
                pneumonia
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Scans</Text>
        {data.recentScans.slice(0, 5).map((scan, index) => (
          <View key={index} style={styles.scanRow}>
            <View style={styles.scanInfo}>
              <Text style={styles.scanId}>{scan.id}</Text>
              <Text style={styles.scanDate}>{formatDate(scan.createdAt)}</Text>
            </View>
            <View
              style={[
                styles.resultBadge,
                scan.result === "PNEUMONIA"
                  ? styles.resultDanger
                  : styles.resultSafe,
              ]}
            >
              <Text style={styles.resultText}>
                {scan.result} • {scan.confidence?.toFixed(0)}%
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function ScansTab({ data }: { data: ScanResultStatistics }) {
  const chartData = {
    labels: data.timelineData.slice(-7).map((d) => d.date.slice(5)), // Last 7 days
    datasets: [
      {
        data: data.timelineData.slice(-7).map((d) => d.scans),
        strokeWidth: 2,
        color: () => "#0066CC",
      },
    ],
  };

  return (
    <View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Result Breakdown</Text>
        <View style={styles.breakdownContainer}>
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownLabel}>Pneumonia</Text>
            <Text style={styles.breakdownValue}>
              {data.resultBreakdown.pneumonia}
            </Text>
            <Text style={styles.breakdownPercentage}>
              {data.resultBreakdown.pneumoniaPercentage.toFixed(1)}%
            </Text>
          </View>
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownLabel}>Normal</Text>
            <Text style={styles.breakdownValue}>
              {data.resultBreakdown.normal}
            </Text>
            <Text style={styles.breakdownPercentage}>
              {data.resultBreakdown.normalPercentage.toFixed(1)}%
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Timeline</Text>
        <LineChart
          data={chartData}
          width={screenWidth - 32}
          height={200}
          chartConfig={{
            backgroundColor: "#FFFFFF",
            backgroundGradientFrom: "#FFFFFF",
            backgroundGradientTo: "#FFFFFF",
            color: () => "#0066CC",
            strokeWidth: 2,
          }}
          style={styles.chart}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Confidence Distribution</Text>
        <View style={styles.confidenceContainer}>
          <ConfidenceBar
            label="Excellent (>0.9)"
            value={data.confidenceDistribution.excellent}
            color="#4CAF50"
          />
          <ConfidenceBar
            label="Good (0.8-0.9)"
            value={data.confidenceDistribution.good}
            color="#FF9800"
          />
          <ConfidenceBar
            label="Fair (<0.8)"
            value={data.confidenceDistribution.fair}
            color="#D32F2F"
          />
        </View>
      </View>
    </View>
  );
}

function PatientsTab({ data }: { data: PatientAnalytics }) {
  return (
    <View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Patient Metrics</Text>
        <View style={styles.metricsGrid}>
          <MetricCard
            label="Total Patients"
            value={data.totalPatients.toString()}
            icon="people"
            color="#0066CC"
          />
          <MetricCard
            label="New This Month"
            value={data.newPatientsThisMonth.toString()}
            icon="person-add"
            color="#4CAF50"
          />
          <MetricCard
            label="With Pneumonia"
            value={data.patientsWithPneumonia.toString()}
            icon="alert-circle"
            color="#D32F2F"
          />
          <MetricCard
            label="Avg Scans"
            value={data.averageScansPerPatient.toFixed(1)}
            icon="stats-chart"
            color="#9C27B0"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Patients by Scans</Text>
        {data.topPatients.map((patient, index) => (
          <View key={index} style={styles.topPatientRow}>
            <View style={styles.rankBadge}>
              <Text style={styles.rankNumber}>{index + 1}</Text>
            </View>
            <View style={styles.topPatientInfo}>
              <Text style={styles.topPatientName}>{patient.name}</Text>
              <Text style={styles.topPatientId}>ID: {patient.idNumber}</Text>
              <Text style={styles.topPatientStats}>
                {patient.scanCount} scans • {patient.pneumoniaDetected}{" "}
                pneumonia
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function MetricCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon: string;
  color: string;
}) {
  return (
    <View style={styles.metricCard}>
      <View style={[styles.metricIcon, { backgroundColor: color + "20" }]}>
        <Ionicons name={icon as any} size={24} color={color} />
      </View>
      <Text style={styles.metricCardValue}>{value}</Text>
      <Text style={styles.metricCardLabel}>{label}</Text>
    </View>
  );
}

function ConfidenceBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <View style={styles.confidenceRow}>
      <Text style={styles.confidenceLabel}>{label}</Text>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            {
              backgroundColor: color,
              width: `${Math.min((value / 100) * 100, 100)}%`,
            },
          ]}
        />
      </View>
      <Text style={styles.confidenceValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F7",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F7",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTextContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 2,
  },
  placeholder: {
    width: 40,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: "#0066CC",
  },
  tabText: {
    fontSize: 14,
    color: "#8E8E93",
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#0066CC",
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginBottom: 12,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  metricCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  metricIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  metricCardValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  metricCardLabel: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 4,
  },
  metricRow: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  metricLabel: {
    fontSize: 14,
    color: "#8E8E93",
  },
  metricValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  patientRow: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  patientStats: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 4,
  },
  scanRow: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scanInfo: {
    flex: 1,
  },
  scanId: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  scanDate: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 4,
  },
  resultBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  resultDanger: {
    backgroundColor: "#D32F2F20",
  },
  resultSafe: {
    backgroundColor: "#4CAF5020",
  },
  resultText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  breakdownContainer: {
    flexDirection: "row",
    gap: 12,
  },
  breakdownItem: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  breakdownLabel: {
    fontSize: 12,
    color: "#8E8E93",
  },
  breakdownValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginTop: 8,
  },
  breakdownPercentage: {
    fontSize: 14,
    color: "#0066CC",
    marginTop: 4,
    fontWeight: "600",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  confidenceContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
  },
  confidenceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  confidenceLabel: {
    fontSize: 12,
    color: "#8E8E93",
    width: 100,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#E5E5EA",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  confidenceValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1C1C1E",
    width: 40,
    textAlign: "right",
  },
  topPatientRow: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#0066CC",
    justifyContent: "center",
    alignItems: "center",
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  topPatientInfo: {
    flex: 1,
  },
  topPatientName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  topPatientId: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 2,
  },
  topPatientStats: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 2,
  },
  loadingText: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 12,
  },
  bottomSpacer: {
    height: 40,
  },
});
