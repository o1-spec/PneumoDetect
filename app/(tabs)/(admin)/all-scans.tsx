import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useToast } from "../../../hooks/useToast";
import { scansAPI } from "../../../services/api.client";
import { Scan } from "../../../types/api";
import { formatDate, formatTime } from "../../../utils/dateFormatter";
import { getErrorMessage } from "../../../utils/errorHandler";
import { dialogManager } from "../../../utils/dialogManager";
import { PneumoLoader } from "../../../components/premium";
import { COLORS, BORDER_RADIUS, SHADOWS, SPACING } from "../../../constants/Theme";

export default function AllScansScreen() {
  const insets = useSafeAreaInsets();
  const { success, error: showError } = useToast();
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "PNEUMONIA" | "NORMAL"
  >("all");

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
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const data = await scansAPI.getAll();
      setScans(Array.isArray(data) ? data : []);
      success("Scans refreshed");
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setRefreshing(false);
    }
  };

  const filteredScans = scans.filter((scan: Scan) => {
    const matchesSearch =
      scan.patient?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scan.patient?.idNumber
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      scan.id?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || scan.result === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const pneumoniaCount = scans.filter(
    (s: Scan) => s.result === "PNEUMONIA",
  ).length;
  const normalCount = scans.filter((s: Scan) => s.result === "NORMAL").length;

  const handleDeleteScan = (scanId: string, patientName: string) => {
    dialogManager.show({
      title: "Delete Scan",
      message: `Are you sure you want to delete scan for ${patientName}? This action cannot be undone.`,
      buttons: [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              // TODO: Implement delete endpoint on backend
              // await scansAPI.deleteScan(scanId);
              setScans((prev) => prev.filter((s) => s.id !== scanId));
              success("Scan deleted successfully");
            } catch (err) {
              showError(getErrorMessage(err));
            }
          },
        },
      ],
    });
  };

  const handleViewDetails = (scan: Scan) => {
    router.push({
      pathname: "/analysis/results/[scanId]",
      params: {
        scanId: scan.id,
        imageUri: scan.imageUrl,
        patientId: scan.patientId,
        patientName: scan.patient?.name || "Unknown",
        age: scan.patient?.age?.toString() || "Unknown",
        sex: scan.patient?.gender || "Unknown",
        scanDate: formatDate(scan.createdAt),
        result: scan.result || "UNKNOWN",
        confidence: scan.confidence?.toString() || "0",
      },
    });
  };

  const renderScanCard = ({ item }: { item: Scan }) => {
    const isPneumonia = item.result === "PNEUMONIA";

    return (
      <TouchableOpacity
        style={[
          styles.scanCard,
          { borderLeftWidth: 4, borderLeftColor: isPneumonia ? COLORS.danger : COLORS.success }
        ]}
        onPress={() => handleViewDetails(item)}
      >
        <View style={styles.scanHeader}>
          <Image source={{ uri: item.imageUrl }} style={styles.thumbnail} />
          <View style={styles.scanInfo}>
            <Text style={styles.scanId}>{item.id}</Text>
            <Text style={styles.patientName}>
              {item.patient?.name || "Unknown"}
            </Text>
            <Text style={styles.patientId}>
              ID: {item.patient?.idNumber || item.patientId}
            </Text>
            <View style={styles.dateTimeRow}>
              <Ionicons name="calendar-outline" size={12} color={COLORS.textSecondary} />
              <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
              <Ionicons name="time-outline" size={12} color={COLORS.textSecondary} />
              <Text style={styles.timeText}>{formatTime(item.createdAt)}</Text>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.predictionBadge,
            isPneumonia ? styles.predictionDanger : styles.predictionSafe,
          ]}
        >
          <Ionicons
            name={isPneumonia ? "warning" : "checkmark-circle"}
            size={16}
            color={isPneumonia ? COLORS.danger : COLORS.success}
          />
          <Text
            style={[
              styles.predictionText,
              { color: isPneumonia ? COLORS.danger : COLORS.success },
            ]}
          >
            {item.result === "PNEUMONIA" ? "Pneumonia Detected" : "Normal"}
          </Text>
          <Text style={styles.confidenceText}>
            {item.confidence ? item.confidence.toFixed(1) : "0"}%
          </Text>
        </View>

        <View style={styles.clinicianRow}>
          <Ionicons name="person-circle-outline" size={16} color={COLORS.textSecondary} />
          <Text style={styles.clinicianText}>
            Analyzed by {item.doctor?.name || "Unknown"}
          </Text>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => handleViewDetails(item)}
          >
            <Ionicons name="eye-outline" size={18} color={COLORS.primary} />
            <Text style={styles.viewButtonText}>View Details</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteIconButton}
            onPress={() =>
              handleDeleteScan(item.id, item.patient?.name || "Unknown")
            }
          >
            <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

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
            <Text style={styles.headerTitle}>All Scans</Text>
            <Text style={styles.headerSubtitle}>
              {filteredScans.length}{" "}
              {filteredScans.length === 1 ? "scan" : "scans"}
            </Text>
          </View>
          <View style={styles.headerIcon}>
            <Ionicons name="analytics-outline" size={24} color={COLORS.primary} />
          </View>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{scans.length}</Text>
          <Text style={styles.statLabel}>Total Scans</Text>
        </View>
        <View style={[styles.statCard, styles.dangerCard]}>
          <Text style={[styles.statValue, styles.dangerText]}>
            {pneumoniaCount}
          </Text>
          <Text style={styles.statLabel}>Pneumonia</Text>
        </View>
        <View style={[styles.statCard, styles.safeCard]}>
          <Text style={[styles.statValue, styles.safeText]}>{normalCount}</Text>
          <Text style={styles.statLabel}>Normal</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={COLORS.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search scans..."
          placeholderTextColor={COLORS.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filterStatus === "all" && styles.filterButtonActive,
          ]}
          onPress={() => setFilterStatus("all")}
        >
          <Text
            style={[
              styles.filterButtonText,
              filterStatus === "all" && styles.filterButtonTextActive,
            ]}
          >
            All ({scans.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filterStatus === "PNEUMONIA" && styles.filterButtonActive,
          ]}
          onPress={() => setFilterStatus("PNEUMONIA")}
        >
          <Text
            style={[
              styles.filterButtonText,
              filterStatus === "PNEUMONIA" && styles.filterButtonTextActive,
            ]}
          >
            Pneumonia ({pneumoniaCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filterStatus === "NORMAL" && styles.filterButtonActive,
          ]}
          onPress={() => setFilterStatus("NORMAL")}
        >
          <Text
            style={[
              styles.filterButtonText,
              filterStatus === "NORMAL" && styles.filterButtonTextActive,
            ]}
          >
            Normal ({normalCount})
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <PneumoLoader size={48} color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredScans}
          renderItem={renderScanCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="document-outline" size={64} color={COLORS.border} />
              <Text style={styles.emptyText}>No scans found</Text>
            </View>
          }
        />
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
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  statsContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  dangerCard: {
    backgroundColor: COLORS.dangerLight,
    borderColor: COLORS.dangerLight,
  },
  safeCard: {
    backgroundColor: COLORS.successLight,
    borderColor: COLORS.successLight,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  dangerText: {
    color: COLORS.danger,
  },
  safeText: {
    color: COLORS.success,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    borderRadius: BORDER_RADIUS.md,
    height: 50,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  filterButtonTextActive: {
    color: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
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
    marginBottom: 12,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: COLORS.primaryLight,
    marginRight: 12,
  },
  scanInfo: {
    flex: 1,
  },
  scanId: {
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 4,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  patientId: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  dateTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginRight: 8,
  },
  timeText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  predictionBadge: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    gap: 8,
    marginBottom: 12,
  },
  predictionDanger: {
    backgroundColor: COLORS.dangerLight,
  },
  predictionSafe: {
    backgroundColor: COLORS.successLight,
  },
  predictionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
  },
  confidenceText: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  clinicianRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  clinicianText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
  },
  viewButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primaryLight,
    borderRadius: 8,
    paddingVertical: 10,
    gap: 6,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },
  deleteIconButton: {
    width: 44,
    height: 44,
    backgroundColor: COLORS.dangerLight,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 16,
  },
});
