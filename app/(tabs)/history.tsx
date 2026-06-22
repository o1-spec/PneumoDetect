import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { PremiumChip, PneumoLoader } from "../../components/premium";
import { scansAPI } from "../../services/api.client";
import { Scan } from "../../types/api";
import { formatDate } from "../../utils/dateFormatter";
import { useToast } from "../../hooks/useToast";
import { COLORS, BORDER_RADIUS, SHADOWS, SPACING } from "../../constants/Theme";

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
      <Ionicons name="medical-outline" size={width * 0.4} color="#64748B" />
      <Text style={{ fontSize: width > 100 ? 12 : 8, color: "#64748B", marginTop: 4, fontWeight: "600", textAlign: "center" }}>
        No Scan
      </Text>
    </View>
  );
};

export default function CasesScreen() {
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "PNEUMONIA" | "NORMAL"
  >("all");
  const { error: showError } = useToast();

  useFocusEffect(
    useCallback(() => {
      loadScans();
    }, []),
  );

  const loadScans = async () => {
    try {
      setLoading(true);
      const data = await scansAPI.getAll();
      setScans(Array.isArray(data) ? data : []);
    } catch (error) {
      showError("Failed to load scan history");
      setScans([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const data = await scansAPI.getAll();
      setScans(Array.isArray(data) ? data : []);
    } catch (error) {
      showError("Failed to refresh scan history");
    } finally {
      setRefreshing(false);
    }
  };

  const filteredHistory = scans.filter((scan) => {
    const matchesSearch =
      (scan.patient?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ??
        false) ||
      (scan.patient?.idNumber
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ??
        false) ||
      scan.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || scan.result === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getConfidenceLabel = (conf: number) => {
    if (conf >= 90) return "High Confidence";
    if (conf >= 70) return "Moderate Confidence";
    return "Low Confidence";
  };

  const renderHistoryItem = ({ item }: { item: Scan }) => {
    const isPneumonia = item.result === "PNEUMONIA";

    return (
      <TouchableOpacity
        style={styles.historyCard}
        onPress={() =>
          router.push({
            pathname: "/analysis/results/[scanId]",
            params: {
              scanId: item.id,
              imageUri: item.imageUrl || "",
              patientId: item.patient?.idNumber || "N/A",
              patientName: item.patient?.name || "Unknown Patient",
              age: item.patient?.age?.toString() || "N/A",
              sex: item.patient?.gender === "MALE" ? "Male" : "Female",
              scanDate: new Date(item.createdAt).toLocaleDateString(),
              result: item.result || "NORMAL",
              confidence: (item.confidence || 0).toString(),
              heatmapUrl: item.heatmapUrl || "",
            }
          })
        }
      >
        <XrayThumbnail uri={item.imageUrl} width={76} height={76} />

        <View style={styles.historyInfo}>
          <View style={styles.historyHeader}>
            <Text style={styles.scanId}>#{item.patient?.idNumber || item.id.substring(0, 8)}</Text>
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
          </View>

          <Text style={styles.patientName}>
            {item.patient?.name || "Unknown Patient"}
          </Text>
          <Text style={styles.scanDateText}>
            Analyzed: {formatDate(item.createdAt)}
          </Text>

          <View style={styles.historyFooter}>
            <Text style={styles.confidenceText}>
              {item.confidence?.toFixed(0)}% Confidence • <Text style={styles.confidenceLabelSub}>
                {getConfidenceLabel(item.confidence || 0)}
              </Text>
            </Text>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={18} color={COLORS.textTertiary} style={styles.chevron} />
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <PneumoLoader size={48} color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Registry Top Header */}
      <View style={styles.registryHeaderTitleContainer}>
        <Text style={styles.registryHeaderTitle}>Case Registry</Text>
        <Text style={styles.registryHeaderSubtitle}>{scans.length} total patient screening cases</Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={COLORS.textTertiary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search patient ID, name..."
          placeholderTextColor={COLORS.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color={COLORS.textTertiary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterChip, filterStatus === "all" && styles.filterChipActive]}
          onPress={() => setFilterStatus("all")}
        >
          <Text style={[styles.filterChipText, filterStatus === "all" && styles.filterChipTextActive]}>All Cases</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterChip, filterStatus === "PNEUMONIA" && styles.filterChipActive]}
          onPress={() => setFilterStatus("PNEUMONIA")}
        >
          <Text style={[styles.filterChipText, filterStatus === "PNEUMONIA" && styles.filterChipTextActive]}>Pneumonia</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterChip, filterStatus === "NORMAL" && styles.filterChipActive]}
          onPress={() => setFilterStatus("NORMAL")}
        >
          <Text style={[styles.filterChipText, filterStatus === "NORMAL" && styles.filterChipTextActive]}>Normal</Text>
        </TouchableOpacity>
      </View>

      {/* Cases Registry List */}
      <FlatList
        data={filteredHistory}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBox}>
              <Ionicons name="images-outline" size={48} color={COLORS.textTertiary} />
            </View>
            <Text style={styles.emptyText}>No screening cases found</Text>
            <Text style={styles.emptySubtext}>Try adjusting filters or search query</Text>
          </View>
        }
      />
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
  registryHeaderTitleContainer: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: COLORS.card,
  },
  registryHeaderTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  registryHeaderSubtitle: {
    fontSize: 13,
    color: COLORS.textTertiary,
    fontWeight: "600",
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    marginHorizontal: 20,
    marginTop: 16,
    paddingHorizontal: 16,
    borderRadius: BORDER_RADIUS.sm,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 8,
    marginTop: 14,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  filterChipTextActive: {
    color: "#FFFFFF",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  historyCard: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  historyInfo: {
    flex: 1,
    marginLeft: 14,
  },
  historyHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  scanId: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: "800",
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
  textDanger: {
    color: COLORS.danger,
  },
  textSuccess: {
    color: COLORS.success,
  },
  patientName: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  scanDateText: {
    fontSize: 11,
    color: COLORS.textTertiary,
    marginTop: 2,
    fontWeight: "500",
  },
  historyFooter: {
    marginTop: 8,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  confidenceLabelSub: {
    fontWeight: "800",
    color: COLORS.primary,
  },
  chevron: {
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
  },
  emptyIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: "800",
  },
  emptySubtext: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontWeight: "500",
  },
});
