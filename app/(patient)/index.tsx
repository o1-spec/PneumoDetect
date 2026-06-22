import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card, PneumoLoader } from "../../components/premium";
import { AuthContext } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { notificationsAPI, scansAPI } from "../../services/api.client";
import type { Scan } from "../../types/api";
import { getErrorMessage } from "../../utils/errorHandler";
import { COLORS, BORDER_RADIUS, SHADOWS, SPACING } from "../../constants/Theme";

export default function PatientDashboardScreen() {
  const insets = useSafeAreaInsets();
  const authContext = useContext(AuthContext);
  const { error: showError } = useToast();
  const [latestScan, setLatestScan] = useState<Scan | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  if (!authContext) {
    return <Text>Auth context not available</Text>;
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await scansAPI.getMyScans();
      const scans = response.scans || response || [];
      
      if (Array.isArray(scans) && scans.length > 0) {
        // Fetch detailed view of the latest scan to get the image URL if available
        try {
          const detailScan = await scansAPI.getScanPatientView(scans[0].id);
          setLatestScan(detailScan.scan || detailScan);
        } catch {
          setLatestScan(scans[0]);
        }
      } else {
        setLatestScan(null);
      }
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
    await loadDashboardData();
    setRefreshing(false);
  };

  const navigateToScan = (scanId: string) => {
    router.push({
      pathname: "/(patient)/scan-details",
      params: { scanId },
    });
  };

  const getStatusText = (scan: Scan) => {
    if (scan.status === "PROCESSING" || scan.status === "UPLOADED") {
      return "Analysis in Progress";
    }
    if (scan.result === "NORMAL") {
      return "Normal";
    }
    return "Review Recommended";
  };

  const getStatusColor = (scan: Scan) => {
    if (scan.status === "PROCESSING" || scan.status === "UPLOADED") {
      return COLORS.secondary;
    }
    if (scan.result === "NORMAL") {
      return COLORS.success;
    }
    return COLORS.danger;
  };

  const getStatusBgColor = (scan: Scan) => {
    if (scan.status === "PROCESSING" || scan.status === "UPLOADED") {
      return COLORS.secondaryLight;
    }
    if (scan.result === "NORMAL") {
      return COLORS.successLight;
    }
    return COLORS.dangerLight;
  };

  return (
    <View style={styles.container}>
      {/* Header bar */}
      <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top + 8 : 16 }]}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Health Updates</Text>
            <Text style={styles.headerSubtitle}>Track your scan reports and results</Text>
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
        {loading ? (
          <View style={styles.loaderContainer}>
            <PneumoLoader size={48} color={COLORS.primary} />
          </View>
        ) : latestScan ? (
          <View style={styles.mainContainer}>
            
            {/* Latest Scan Result Card */}
            <Text style={styles.sectionTitle}>Latest Scan Result</Text>
            
            <Card border={true} elevated="light" style={styles.latestCard}>
              <View style={styles.cardHeader}>
                <View style={styles.xrayThumbnailContainer}>
                  {latestScan.imageUrl ? (
                    <Image source={{ uri: latestScan.imageUrl }} style={styles.xrayImage} />
                  ) : (
                    <View style={styles.placeholderThumbnail}>
                      <Ionicons name="image-outline" size={32} color={COLORS.primary} />
                    </View>
                  )}
                </View>
                <View style={styles.scanMetaInfo}>
                  <Text style={styles.scanLabel}>Chest X-Ray Preview</Text>
                  <Text style={styles.scanDate}>
                    {new Date(latestScan.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                  
                  <View style={styles.statusRow}>
                    <Text style={styles.statusLabel}>AI Assessment:</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusBgColor(latestScan) },
                      ]}
                    >
                      <Text style={[styles.statusText, { color: getStatusColor(latestScan) }]}>
                        {getStatusText(latestScan)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.viewReportButton}
                  onPress={() => navigateToScan(latestScan.id)}
                >
                  <Text style={styles.viewReportButtonText}>View Report</Text>
                  <Ionicons name="document-text-outline" size={16} color="#FFFFFF" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.uploadNewButton}
                  onPress={() => router.push("/(patient)/upload")}
                >
                  <Text style={styles.uploadNewButtonText}>Upload New Scan</Text>
                  <Ionicons name="cloud-upload-outline" size={16} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            </Card>

            {/* Analysis Timeline */}
            <Text style={styles.sectionTitle}>Analysis Timeline</Text>
            <Card border={true} elevated="none" style={styles.timelineCard}>
              <Text style={styles.timelineHeader}>Recent Activity</Text>
              
              <View style={styles.timelineList}>
                <TimelineItem
                  label="Scan Uploaded"
                  subtitle="Your file has been uploaded securely"
                  checked={true}
                />
                <TimelineItem
                  label="Analysis Complete"
                  subtitle="AI model screening complete"
                  checked={latestScan.status === "COMPLETED"}
                />
                <TimelineItem
                  label="Report Generated"
                  subtitle="Clinical report compiled and ready"
                  checked={latestScan.status === "COMPLETED"}
                  isLast={true}
                />
              </View>
            </Card>
          </View>
        ) : (
          /* Empty state */
          <View style={styles.emptyContainer}>
            <View style={styles.emptyCard}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="medical-outline" size={40} color={COLORS.primary} />
              </View>
              <Text style={styles.emptyTitle}>No Scans Available</Text>
              <Text style={styles.emptySubtitle}>
                Upload a chest scan to receive an instant AI assessment.
              </Text>
              <TouchableOpacity
                style={styles.emptyUploadButton}
                onPress={() => router.push("/(patient)/upload")}
              >
                <Text style={styles.emptyUploadButtonText}>Upload Your First Scan</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Quick Actions (Always Visible) */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity
              style={styles.actionGridItem}
              onPress={() => router.push("/(patient)/upload")}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: COLORS.primaryLight }]}>
                <Ionicons name="cloud-upload-outline" size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.actionGridLabel}>New Analysis</Text>
              <Text style={styles.actionGridSub}>Upload a scan</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionGridItem}
              onPress={() => router.push("/(patient)/my-scans")}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: COLORS.successLight }]}>
                <Ionicons name="folder-open-outline" size={24} color={COLORS.success} />
              </View>
              <Text style={styles.actionGridLabel}>View Reports</Text>
              <Text style={styles.actionGridSub}>Browse history</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Legal/Disclaimer Info card */}
        <View style={styles.disclaimerContainer}>
          <Ionicons name="information-circle-outline" size={20} color={COLORS.textTertiary} />
          <Text style={styles.disclaimerText}>
            This AI result is for screening support and should be reviewed by a qualified healthcare professional.
          </Text>
        </View>
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const TimelineItem = ({
  label,
  subtitle,
  checked,
  isLast = false,
}: {
  label: string;
  subtitle: string;
  checked: boolean;
  isLast?: boolean;
}) => (
  <View style={styles.timelineItem}>
    <View style={styles.timelineLeft}>
      <View
        style={[
          styles.timelineIndicator,
          checked ? styles.indicatorChecked : styles.indicatorPending,
        ]}
      >
        {checked && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
      </View>
      {!isLast && <View style={[styles.timelineLine, checked && styles.lineChecked]} />}
    </View>
    <View style={styles.timelineRight}>
      <Text style={[styles.timelineLabel, checked ? styles.textActive : styles.textPending]}>
        {label}
      </Text>
      <Text style={styles.timelineSub}>{subtitle}</Text>
    </View>
  </View>
);

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
    fontSize: 28,
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
  loaderContainer: {
    paddingVertical: 100,
    alignItems: "center",
  },
  mainContainer: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
    marginBottom: 12,
    marginTop: 20,
  },
  latestCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  xrayThumbnailContainer: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.sm,
    overflow: "hidden",
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  xrayImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholderThumbnail: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primaryLight,
  },
  scanMetaInfo: {
    flex: 1,
    justifyContent: "center",
  },
  scanLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  scanDate: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  statusLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  cardActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 16,
  },
  viewReportButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.md,
  },
  viewReportButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  uploadNewButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.md,
  },
  uploadNewButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "700",
  },
  timelineCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  timelineHeader: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  timelineList: {
    gap: 0,
  },
  timelineItem: {
    flexDirection: "row",
    minHeight: 56,
  },
  timelineLeft: {
    alignItems: "center",
    marginRight: 16,
    width: 24,
  },
  timelineIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  indicatorChecked: {
    backgroundColor: COLORS.success,
  },
  indicatorPending: {
    backgroundColor: COLORS.border,
  },
  timelineLine: {
    width: 2,
    position: "absolute",
    top: 24,
    bottom: -12,
    backgroundColor: COLORS.border,
    zIndex: 5,
  },
  lineChecked: {
    backgroundColor: COLORS.success,
  },
  timelineRight: {
    flex: 1,
    paddingBottom: 16,
  },
  timelineLabel: {
    fontSize: 14,
    fontWeight: "700",
  },
  textActive: {
    color: COLORS.textPrimary,
  },
  textPending: {
    color: COLORS.textTertiary,
  },
  timelineSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontWeight: "500",
  },
  emptyContainer: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
  },
  emptyCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: 32,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
    fontWeight: "500",
  },
  emptyUploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: BORDER_RADIUS.md,
    marginTop: 24,
    ...SHADOWS.light,
  },
  emptyUploadButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  actionsContainer: {
    paddingHorizontal: SPACING.md,
  },
  actionGrid: {
    flexDirection: "row",
    gap: 12,
  },
  actionGridItem: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    padding: 16,
    ...SHADOWS.light,
  },
  actionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  actionGridLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  actionGridSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontWeight: "500",
  },
  disclaimerContainer: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: SPACING.md,
    marginTop: 32,
    alignItems: "flex-start",
  },
  disclaimerText: {
    flex: 1,
    fontSize: 11,
    color: COLORS.textTertiary,
    lineHeight: 16,
    fontWeight: "500",
  },
  bottomSpacer: {
    height: 40,
  },
});
