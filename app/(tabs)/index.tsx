import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

// Mock statistics
const stats = {
  totalScans: 156,
  pneumoniaDetected: 42,
  normalScans: 114,
  accuracy: 94.5,
  todayScans: 8,
  weeklyGrowth: 12.5,
};

const recentScans = [
  {
    id: "SCAN-2024-001",
    patient: "John Doe",
    date: "2024-02-17",
    result: "Pneumonia",
    confidence: 94.5,
  },
  {
    id: "SCAN-2024-002",
    patient: "Jane Smith",
    date: "2024-02-17",
    result: "Normal",
    confidence: 88.2,
  },
  {
    id: "SCAN-2024-003",
    patient: "Robert Lee",
    date: "2024-02-16",
    result: "Pneumonia",
    confidence: 91.8,
  },
];

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

export default function DashboardScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Welcome Card */}
      <View style={styles.welcomeCard}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>Dr. Sarah Johnson</Text>
        </View>
        <View style={styles.iconContainer}>
          <Ionicons name="medical" size={40} color="#0066CC" />
        </View>
      </View>

      {/* Quick Actions */}
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

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push("/(tabs)/(admin)/users")}
          >
            <View style={[styles.actionIcon, styles.quaternaryBg]}>
              <Ionicons name="people" size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.actionText}>Users</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Statistics Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.totalCard]}>
            <Ionicons name="document-text" size={24} color="#0066CC" />
            <Text style={styles.statValue}>{stats.totalScans}</Text>
            <Text style={styles.statLabel}>Total Scans</Text>
          </View>

          <View style={[styles.statCard, styles.dangerCard]}>
            <Ionicons name="warning" size={24} color="#D32F2F" />
            <Text style={[styles.statValue, styles.dangerText]}>
              {stats.pneumoniaDetected}
            </Text>
            <Text style={styles.statLabel}>Pneumonia</Text>
          </View>

          <View style={[styles.statCard, styles.safeCard]}>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            <Text style={[styles.statValue, styles.safeText]}>
              {stats.normalScans}
            </Text>
            <Text style={styles.statLabel}>Normal</Text>
          </View>

          <View style={[styles.statCard, styles.accuracyCard]}>
            <Ionicons name="star" size={24} color="#FF9800" />
            <Text style={[styles.statValue, styles.accuracyText]}>
              {stats.accuracy}%
            </Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>
        </View>
      </View>

      {/* Weekly Activity Chart */}
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
            <Text style={styles.chartSubtext}>
              ↑ {stats.weeklyGrowth}% vs last week
            </Text>
          </View>
        </View>
      </View>

      {/* Recent Scans */}
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
                <Text style={styles.patientName}>{scan.patient}</Text>
              </View>
              <View
                style={[
                  styles.resultBadge,
                  scan.result === "Pneumonia"
                    ? styles.resultDanger
                    : styles.resultSafe,
                ]}
              >
                <Text
                  style={[
                    styles.resultText,
                    scan.result === "Pneumonia"
                      ? styles.resultTextDanger
                      : styles.resultTextSafe,
                  ]}
                >
                  {scan.result}
                </Text>
              </View>
            </View>
            <View style={styles.scanFooter}>
              <Text style={styles.scanDate}>
                <Ionicons name="calendar-outline" size={12} color="#8E8E93" />{" "}
                {scan.date}
              </Text>
              <Text style={styles.scanConfidence}>
                {scan.confidence}% confidence
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* System Status */}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F7",
    paddingTop: 60,
  },
  welcomeCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    margin: 16,
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
});
