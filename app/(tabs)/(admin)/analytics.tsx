import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LineChart } from "react-native-chart-kit";
import { analyticsAPI } from "../../../services/api.client";
import {
    DashboardMetrics,
    PatientAnalytics,
    ScanResultStatistics,
} from "../../../types/api";
import { formatDate } from "../../../utils/dateFormatter";
import { useToast } from "../../../hooks/useToast";
import { COLORS, BORDER_RADIUS, SHADOWS, SPACING } from "../../../constants/Theme";

const screenWidth = Dimensions.get("window").width;

export default function AnalyticsScreen() {
  const insets = useSafeAreaInsets();
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
  const { error: showError } = useToast();

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
      showError("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await loadAnalytics();
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading analytics...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top + 8 : 16 }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
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
            color={COLORS.primary}
          />
          <MetricCard
            label="Patients"
            value={data.totalPatients.toString()}
            icon="people"
            color={COLORS.success}
          />
          <MetricCard
            label="Pneumonia"
            value={data.pneumoniaDetected.toString()}
            icon="warning"
            color={COLORS.danger}
          />
          <MetricCard
            label="Accuracy"
            value={`${(data.accuracyRate * 100).toFixed(1)}%`}
            icon="checkmark-circle"
            color={COLORS.warning}
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
        color: () => COLORS.primary,
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
            backgroundColor: COLORS.card,
            backgroundGradientFrom: COLORS.card,
            backgroundGradientTo: COLORS.card,
            color: () => COLORS.primary,
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
            color={COLORS.success}
          />
          <ConfidenceBar
            label="Good (0.8-0.9)"
            value={data.confidenceDistribution.good}
            color={COLORS.warning}
          />
          <ConfidenceBar
            label="Fair (<0.8)"
            value={data.confidenceDistribution.fair}
            color={COLORS.danger}
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
            color={COLORS.primary}
          />
          <MetricCard
            label="New This Month"
            value={data.newPatientsThisMonth.toString()}
            icon="person-add"
            color={COLORS.success}
          />
          <MetricCard
            label="With Pneumonia"
            value={data.patientsWithPneumonia.toString()}
            icon="alert-circle"
            color={COLORS.danger}
          />
          <MetricCard
            label="Avg Scans"
            value={data.averageScansPerPatient.toFixed(1)}
            icon="stats-chart"
            color={COLORS.primary}
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
    backgroundColor: COLORS.background,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: COLORS.card,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...SHADOWS.light,
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
    backgroundColor: COLORS.primaryLight,
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
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  placeholder: {
    width: 40,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    color: COLORS.textTertiary,
    fontWeight: "500",
  },
  tabTextActive: {
    color: COLORS.primary,
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
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  metricCard: {
    width: "48%",
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: 12,
    alignItems: "center",
    ...SHADOWS.light,
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
    color: COLORS.textPrimary,
  },
  metricCardLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  metricRow: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  metricLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  patientRow: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  patientStats: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  scanRow: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  scanInfo: {
    flex: 1,
  },
  scanId: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  scanDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  resultBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  resultDanger: {
    backgroundColor: COLORS.dangerLight,
  },
  resultSafe: {
    backgroundColor: COLORS.successLight,
  },
  resultText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  breakdownContainer: {
    flexDirection: "row",
    gap: 12,
  },
  breakdownItem: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  breakdownLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  breakdownValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginTop: 8,
  },
  breakdownPercentage: {
    fontSize: 14,
    color: COLORS.primary,
    marginTop: 4,
    fontWeight: "600",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  confidenceContainer: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  confidenceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  confidenceLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    width: 100,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.border,
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
    color: COLORS.textPrimary,
    width: 40,
    textAlign: "right",
  },
  topPatientRow: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
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
    color: COLORS.textPrimary,
  },
  topPatientId: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  topPatientStats: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 12,
  },
  bottomSpacer: {
    height: 40,
  },
});
