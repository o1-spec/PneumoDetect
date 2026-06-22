import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PremiumChip } from "../../components/premium";
import { useToast } from "../../hooks/useToast";
import { scansAPI } from "../../services/api.client";
import type { Scan } from "../../types/api";
import { getErrorMessage } from "../../utils/errorHandler";
import { COLORS, BORDER_RADIUS, SHADOWS, SPACING } from "../../constants/Theme";

const SCREEN_WIDTH = Dimensions.get("window").width;
const COLUMN_WIDTH = (SCREEN_WIDTH - 48) / 2; // Two columns with padding

export default function PatientMyScansScreen() {
  const insets = useSafeAreaInsets();
  const { error: showError } = useToast();
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<"ALL" | "NORMAL" | "RECOMMENDED">("ALL");

  useEffect(() => {
    loadScans();
  }, []);

  const loadScans = async () => {
    try {
      setLoading(true);
      const response = await scansAPI.getMyScans();
      const scans = response.scans || response || [];
      setScans(scans);
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

  const filteredScans = scans.filter((scan: Scan) => {
    if (filter === "NORMAL") return scan.result === "NORMAL";
    if (filter === "RECOMMENDED")
      return scan.result === "PNEUMONIA" || scan.result === "CONCERNS";
    return true;
  });

  const navigateToScan = (scanId: string) => {
    router.push({
      pathname: "/(patient)/scan-details",
      params: { scanId },
    });
  };

  const getStatusText = (scan: Scan) => {
    if (scan.status === "PROCESSING" || scan.status === "UPLOADED") {
      return "Analyzing...";
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
          <TouchableOpacity style={styles.backButton} onPress={() => router.replace("/(patient)")}>
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan History</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      {/* Filter chips */}
      <View style={styles.filterContainer}>
        <PremiumChip
          label={`All (${scans.length})`}
          selected={filter === "ALL"}
          onPress={() => setFilter("ALL")}
        />
        <PremiumChip
          label={`Normal (${scans.filter((s) => s.result === "NORMAL").length})`}
          selected={filter === "NORMAL"}
          onPress={() => setFilter("NORMAL")}
        />
        <PremiumChip
          label={`Review Recommended (${
            scans.filter(
              (s) => s.result === "PNEUMONIA" || s.result === "CONCERNS"
            ).length
          })`}
          selected={filter === "RECOMMENDED"}
          onPress={() => setFilter("RECOMMENDED")}
        />
      </View>

      {/* Scans list / Grid */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={{ marginTop: 40 }}
          />
        ) : filteredScans.length > 0 ? (
          <View style={styles.galleryGrid}>
            {filteredScans.map((scan) => (
              <TouchableOpacity
                key={scan.id}
                style={styles.scanCard}
                onPress={() => navigateToScan(scan.id)}
              >
                {/* Chest X-ray image preview */}
                <View style={styles.imageContainer}>
                  {scan.imageUrl ? (
                    <Image source={{ uri: scan.imageUrl }} style={styles.xrayImage} />
                  ) : (
                    <View style={styles.placeholderImage}>
                      <Ionicons name="image-outline" size={32} color={COLORS.textTertiary} />
                    </View>
                  )}
                  {/* Subtle, soft status badge overlaid on the image */}
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusBgColor(scan) },
                    ]}
                  >
                    <Text style={[styles.statusText, { color: getStatusColor(scan) }]}>
                      {getStatusText(scan)}
                    </Text>
                  </View>
                </View>

                {/* Meta details */}
                <View style={styles.cardDetails}>
                  <Text style={styles.scanDate}>
                    {new Date(scan.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Text>
                  
                  <TouchableOpacity
                    style={styles.viewReportButton}
                    onPress={() => navigateToScan(scan.id)}
                  >
                    <Text style={styles.viewReportText}>View Report</Text>
                    <Ionicons name="arrow-forward" size={12} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="images-outline" size={32} color={COLORS.textTertiary} />
            </View>
            <Text style={styles.emptyText}>No scans found</Text>
            <Text style={styles.emptySubtext}>
              {filter === "ALL"
                ? "Your uploaded scans will appear here"
                : "No matching scans found"}
            </Text>
          </View>
        )}
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
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  filterContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    gap: 8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  galleryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  scanCard: {
    width: COLUMN_WIDTH,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  imageContainer: {
    width: "100%",
    height: 140,
    backgroundColor: "#0F172A",
    position: "relative",
  },
  xrayImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholderImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primaryLight,
  },
  statusBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    ...SHADOWS.light,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "800",
  },
  cardDetails: {
    padding: 12,
  },
  scanDate: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  viewReportButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 8,
  },
  viewReportText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 80,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontWeight: "500",
  },
});
