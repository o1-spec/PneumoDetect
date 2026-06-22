import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useContext, useEffect, useState, useCallback } from "react";
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { PneumoLoader } from "../../components/premium/PneumoLoader";
import { COLORS, BORDER_RADIUS, SHADOWS, SPACING } from "../../constants/Theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthContext } from "../../hooks/useAuth";
import { scansAPI, notificationsAPI } from "../../services/api.client";
import { Scan } from "../../types/api";

const screenWidth = Dimensions.get("window").width;

// Helper component to render chest X-ray thumbnails or placeholder mockups
const XrayThumbnail = ({ uri, width = 64, height = 64 }: { uri?: string; width?: number; height?: number }) => {
  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={{ width, height, borderRadius: BORDER_RADIUS.sm, backgroundColor: "#0F172A" }}
      />
    );
  }
  return (
    <View style={{
      width,
      height,
      borderRadius: BORDER_RADIUS.sm,
      backgroundColor: "#1E293B",
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "#334155"
    }}>
      <Ionicons name="medical-outline" size={width * 0.35} color="#64748B" />
      <Text style={{ fontSize: width > 100 ? 11 : 8, color: "#64748B", marginTop: 4, fontWeight: "600", textAlign: "center" }}>
        {width > 100 ? "No Scan Available" : "No Scan"}
      </Text>
    </View>
  );
};

export default function ClinicalWorkspaceScreen() {
  const insets = useSafeAreaInsets();
  const [scans, setScans] = useState<Scan[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const authContext = useContext(AuthContext);
  const userDisplayName = authContext?.user?.name || "Dr. Femi";

  // Parse last name or default to Dr. Femi
  const clinicianName = userDisplayName.includes("Oluwafemi") 
    ? "Dr. Femi" 
    : (userDisplayName.startsWith("Dr.") ? userDisplayName : `Dr. ${userDisplayName}`);

  useFocusEffect(
    useCallback(() => {
      loadWorkspaceData();
    }, [])
  );

  const loadWorkspaceData = async () => {
    try {
      setLoading(true);
      const scansData = await scansAPI.getAll();
      setScans(Array.isArray(scansData) ? scansData : []);

      try {
        const notificationsData = await notificationsAPI.getAll();
        const unreadCount = notificationsData.filter((n: any) => !n.read).length;
        setNotificationCount(unreadCount);
      } catch (error) {
        setNotificationCount(0);
      }
    } catch (error) {
      setScans([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await loadWorkspaceData();
    } finally {
      setRefreshing(false);
    }
  };

  const handleViewScan = (scan: Scan) => {
    router.push({
      pathname: "/analysis/results/[scanId]",
      params: {
        scanId: scan.id,
        imageUri: scan.imageUrl || "",
        patientId: scan.patient?.idNumber || "N/A",
        patientName: scan.patient?.name || "Unknown Patient",
        age: scan.patient?.age?.toString() || "N/A",
        sex: scan.patient?.gender === "MALE" ? "Male" : "Female",
        scanDate: new Date(scan.createdAt).toLocaleDateString(),
        result: scan.result || "NORMAL",
        confidence: (scan.confidence || 0).toString(),
        heatmapUrl: scan.heatmapUrl || "",
      }
    });
  };

  // Helper for confidence text interpretation
  const getConfidenceLabel = (conf: number) => {
    if (conf >= 90) return "High Confidence";
    if (conf >= 70) return "Moderate Confidence";
    return "Low Confidence";
  };

  // Filter pending review vs processed today
  const pendingCount = scans.filter(s => s.status !== "COMPLETED" && s.status !== "FAILED").length;
  
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const scansProcessedToday = scans.filter(s => {
    const scanDate = new Date(s.createdAt);
    return scanDate >= todayStart && s.status === "COMPLETED";
  }).length;

  // Hero Card data: Use the latest scan, or a high-fidelity mock if the database is empty
  const latestScan = scans.length > 0 ? scans[0] : null;

  return (
    <View style={styles.container}>
      {/* Top Clinical Header */}
      <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top + 8 : 16 }]}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Clinical Workspace</Text>
            <Text style={styles.headerSubtitle}>Good afternoon, {clinicianName}</Text>
            <Text style={styles.headerStatsSubtext}>
              {pendingCount > 0 ? `${pendingCount} cases require review` : "All cases reviewed"} • {scansProcessedToday} scans processed today
            </Text>
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => router.push("/notifications")}
          >
            <Ionicons name="notifications-outline" size={22} color={COLORS.primary} />
            {notificationCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{notificationCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <PneumoLoader size={64} color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {/* Hero Section: Latest Analysis */}
          <View style={styles.heroSection}>
            <Text style={styles.sectionHeaderTitle}>Latest Analysis</Text>
            
            {latestScan ? (
              <View style={styles.heroCard}>
                <View style={styles.heroCardRow}>
                  <XrayThumbnail uri={latestScan.imageUrl} width={120} height={120} />
                  
                  <View style={styles.heroInfo}>
                    <Text style={styles.patientIdLabel}>Patient ID #{latestScan.patient?.idNumber || "N/A"}</Text>
                    <Text style={styles.patientMetaText}>
                      {latestScan.patient?.gender === "MALE" ? "Male" : "Female"}, {latestScan.patient?.age || "N/A"} yrs
                    </Text>
                    
                    <View style={styles.heroFindingContainer}>
                      <Text style={[
                        styles.heroFindingText,
                        latestScan.result === "PNEUMONIA" ? styles.textDanger : styles.textSuccess
                      ]}>
                        {latestScan.result === "PNEUMONIA" ? "Pneumonia Suspected" : "Normal"}
                      </Text>
                      <Text style={styles.heroConfidenceText}>
                        {latestScan.confidence?.toFixed(0)}% • {getConfidenceLabel(latestScan.confidence || 0)}
                      </Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity 
                  style={styles.heroActionButton}
                  onPress={() => handleViewScan(latestScan)}
                >
                  <Text style={styles.heroActionButtonText}>View Findings</Text>
                  <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ) : (
              // Empty state when no scans exist
              <View style={styles.heroCard}>
                <View style={styles.emptyHeroContent}>
                  <View style={styles.emptyHeroIconContainer}>
                    <Ionicons name="medical-outline" size={40} color={COLORS.primary} />
                  </View>
                  <Text style={styles.emptyHeroTitle}>No Analyses Yet</Text>
                  <Text style={styles.emptyHeroSubtitle}>
                    Upload a chest X-ray to run the first AI screening.
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.heroActionButton}
                  onPress={() => router.push("/analysis/upload")}
                >
                  <Text style={styles.heroActionButtonText}>Begin Scan Analysis</Text>
                  <Ionicons name="add" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Active Case Queue List */}
          <View style={styles.queueSection}>
            <View style={styles.queueHeader}>
              <Text style={styles.sectionHeaderTitle}>Active Case Queue</Text>
              <TouchableOpacity onPress={() => router.push("/(tabs)/history")}>
                <Text style={styles.viewAllText}>View Cases</Text>
              </TouchableOpacity>
            </View>

            {scans.length > 0 ? (
              scans.map((scan) => {
                const isPneumonia = scan.result === "PNEUMONIA";
                return (
                  <TouchableOpacity
                    key={scan.id}
                    style={styles.caseRow}
                    onPress={() => handleViewScan(scan)}
                  >
                    <XrayThumbnail uri={scan.imageUrl} width={64} height={64} />
                    
                    <View style={styles.caseDetails}>
                      <View style={styles.caseHeaderRow}>
                        <Text style={styles.casePatientId}>#{scan.patient?.idNumber || scan.id.substring(0, 8)}</Text>
                        <Text style={styles.caseDate}>{new Date(scan.createdAt).toLocaleDateString()}</Text>
                      </View>
                      <Text style={styles.casePatientName}>{scan.patient?.name || "Unknown Patient"}</Text>
                      
                      <View style={styles.caseStatusRow}>
                        <View style={[
                          styles.statusBadge,
                          isPneumonia ? styles.badgeDanger : styles.badgeSuccess
                        ]}>
                          <Text style={[
                            styles.statusBadgeText,
                            isPneumonia ? styles.textDanger : styles.textSuccess
                          ]}>
                            {isPneumonia ? "Pneumonia" : "Normal"}
                          </Text>
                        </View>
                        <Text style={styles.caseConfidenceText}>
                          {scan.confidence?.toFixed(0)}% • {getConfidenceLabel(scan.confidence || 0)}
                        </Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={COLORS.textTertiary} />
                  </TouchableOpacity>
                );
              })
            ) : (
              <View style={styles.emptyQueueState}>
                <View style={styles.emptyQueueIconContainer}>
                  <Ionicons name="briefcase-outline" size={48} color={COLORS.textTertiary} />
                </View>
                <Text style={styles.emptyQueueTitle}>Queue is Empty</Text>
                <Text style={styles.emptyQueueSubtitle}>
                  No active scans in the database. Open 'Analyze' to screen a new chest X-ray image.
                </Text>
                <TouchableOpacity 
                  style={styles.emptyQueueButton}
                  onPress={() => router.push("/analysis/upload")}
                >
                  <Text style={styles.emptyQueueButtonText}>New Scan Analysis</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      )}
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
    alignItems: "flex-start",
    paddingHorizontal: SPACING.md,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: "700",
    marginTop: 2,
  },
  headerStatsSubtext: {
    fontSize: 13,
    color: COLORS.textTertiary,
    fontWeight: "600",
    marginTop: 6,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: COLORS.danger,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
    borderWidth: 1.5,
    borderColor: COLORS.card,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    paddingHorizontal: SPACING.md,
    marginTop: 20,
  },
  sectionHeaderTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  heroCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  heroCardRow: {
    flexDirection: "row",
    gap: 16,
  },
  heroInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  patientIdLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  patientMetaText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "600",
    marginTop: 2,
  },
  heroFindingContainer: {
    marginTop: 12,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  heroFindingText: {
    fontSize: 15,
    fontWeight: "800",
  },
  heroConfidenceText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "700",
    marginTop: 2,
  },
  heroActionButton: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    gap: 6,
  },
  heroActionButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  queueSection: {
    paddingHorizontal: SPACING.md,
    marginTop: 24,
  },
  queueHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "700",
  },
  caseRow: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: 12,
    marginBottom: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  caseDetails: {
    flex: 1,
    marginLeft: 12,
  },
  caseHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  casePatientId: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  caseDate: {
    fontSize: 11,
    color: COLORS.textTertiary,
    fontWeight: "600",
  },
  casePatientName: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "600",
    marginTop: 2,
  },
  caseStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeDanger: {
    backgroundColor: COLORS.dangerLight,
  },
  badgeSuccess: {
    backgroundColor: COLORS.successLight,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "800",
  },
  caseConfidenceText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: "700",
  },
  textDanger: {
    color: COLORS.danger,
  },
  textSuccess: {
    color: COLORS.success,
  },
  emptyHeroContent: {
    alignItems: "center",
    paddingVertical: 16,
  },
  emptyHeroIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  emptyHeroTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  emptyHeroSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 6,
    fontWeight: "500",
    lineHeight: 18,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  emptyQueueState: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: "dashed",
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyQueueIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  emptyQueueTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  emptyQueueSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 18,
    fontWeight: "500",
    marginTop: 6,
    paddingHorizontal: 8,
  },
  emptyQueueButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  emptyQueueButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomSpacer: {
    height: 60,
  },
});
