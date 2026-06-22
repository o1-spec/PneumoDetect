import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card, PneumoLoader, SectionHeader, StatCard } from "../../components/premium";
import { AuthContext } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { notificationsAPI, scansAPI } from "../../services/api.client";
import type { Scan } from "../../types/api";
import { getErrorMessage } from "../../utils/errorHandler";
import { COLORS, BORDER_RADIUS, SHADOWS, SPACING, GRADIENTS } from "../../constants/Theme";

export default function PatientDashboardScreen() {
  const insets = useSafeAreaInsets();
  const authContext = useContext(AuthContext);
  const { error: showError } = useToast();
  const [recentScans, setRecentScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
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

    // Load notification count
    try {
      const data = await notificationsAPI.getAll();
      const unread = Array.isArray(data) ? data.filter((n: any) => !n.read).length : 0;
      setNotificationCount(unread);
    } catch { }
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
      <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top + 8 : 16 }]}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Dashboard</Text>
            <Text style={styles.headerSubtitle}>Track your health updates</Text>
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => router.push("/(patient)/notifications")}
          >
            <Ionicons name="notifications-outline" size={24} color={COLORS.primary} />
            {notificationCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {notificationCount > 9 ? "9+" : notificationCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
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
          colors={GRADIENTS.primary as any}
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
              <Ionicons name="person" size={38} color={COLORS.primary} />
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
                  color={COLORS.primary}
                  backgroundColor={COLORS.primaryLight}
                />
              </View>
              <View style={{ flex: 1 }}>
                <StatCard
                  icon="checkmark-circle-outline"
                  title="Normal"
                  value={stats.normalScans}
                  color={COLORS.success}
                  backgroundColor={COLORS.successLight}
                />
              </View>
            </View>
            <View style={styles.statRow}>
              <View style={{ flex: 1 }}>
                <StatCard
                  icon="alert-circle-outline"
                  title="Concerns"
                  value={stats.pneumoniaScans}
                  color={COLORS.danger}
                  backgroundColor={COLORS.dangerLight}
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
            <PneumoLoader size={48} color={COLORS.primary} style={{ marginTop: 20 }} />
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
                        color={COLORS.textTertiary}
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
              <Ionicons name="document-outline" size={48} color={COLORS.border} />
              <Text style={styles.emptyText}>No scans yet</Text>
              <Text style={styles.emptySubtext}>
                Your scan results will appear here
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Important Notes</Text>
          <Card border={true} elevated="none" backgroundColor={COLORS.primaryLight}>
            <View style={styles.infoContent}>
              <Ionicons name="information-circle" size={24} color={COLORS.primary} />
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
    backgroundColor: COLORS.background,
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontWeight: "500",
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: COLORS.danger,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: COLORS.card,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },
  content: {
    flex: 1,
  },
  welcomeGradient: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    padding: 24,
    ...SHADOWS.medium,
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
    color: "rgba(255, 255, 255, 0.85)",
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
    color: "rgba(255, 255, 255, 0.9)",
  },
  welcomeIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
    ...SHADOWS.light,
  },
  section: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
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
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
    paddingBottom: 10,
  },
  viewAllText: {
    fontSize: 14,
    color: COLORS.primary,
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
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
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
    color: COLORS.primary,
    fontWeight: "700",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  scanPatient: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  resultBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  resultDanger: {
    backgroundColor: COLORS.dangerLight,
  },
  resultSafe: {
    backgroundColor: COLORS.successLight,
  },
  resultText: {
    fontSize: 12,
    fontWeight: "700",
  },
  resultTextSafe: {
    color: COLORS.success,
  },
  resultTextDanger: {
    color: COLORS.danger,
  },
  scanFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
  },
  scanDate: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  scanConfidence: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
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
    color: COLORS.primary,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    fontWeight: "500",
  },
  bottomSpacer: {
    height: 40,
  },
});
