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
import { useToast } from "../../../hooks/useToast";
import { scansAPI } from "../../../services/api.client";
import { Scan } from "../../../types/api";
import { formatDate, formatTime } from "../../../utils/dateFormatter";
import { getErrorMessage } from "../../../utils/errorHandler";
import { dialogManager } from "../../../utils/dialogManager";

export default function AllScansScreen() {
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
        style={styles.scanCard}
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
              <Ionicons name="calendar-outline" size={12} color="#8E8E93" />
              <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
              <Ionicons name="time-outline" size={12} color="#8E8E93" />
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
            color={isPneumonia ? "#D32F2F" : "#4CAF50"}
          />
          <Text
            style={[
              styles.predictionText,
              isPneumonia ? styles.textDanger : styles.textSafe,
            ]}
          >
            {item.result === "PNEUMONIA" ? "Pneumonia Detected" : "Normal"}
          </Text>
          <Text style={styles.confidenceText}>
            {item.confidence ? item.confidence.toFixed(1) : "0"}%
          </Text>
        </View>

        <View style={styles.clinicianRow}>
          <Ionicons name="person-circle-outline" size={16} color="#8E8E93" />
          <Text style={styles.clinicianText}>
            Analyzed by {item.doctor?.name || "Unknown"}
          </Text>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => handleViewDetails(item)}
          >
            <Ionicons name="eye-outline" size={18} color="#0066CC" />
            <Text style={styles.viewButtonText}>View Details</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteIconButton}
            onPress={() =>
              handleDeleteScan(item.id, item.patient?.name || "Unknown")
            }
          >
            <Ionicons name="trash-outline" size={18} color="#D32F2F" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

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
            <Text style={styles.headerTitle}>All Scans</Text>
            <Text style={styles.headerSubtitle}>
              {filteredScans.length}{" "}
              {filteredScans.length === 1 ? "scan" : "scans"}
            </Text>
          </View>
          <View style={styles.headerIcon}>
            <Ionicons name="analytics-outline" size={24} color="#0066CC" />
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
          color="#8E8E93"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search scans..."
          placeholderTextColor="#8E8E93"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color="#8E8E93" />
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
          <ActivityIndicator size="large" color="#0066CC" />
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
              <Ionicons name="document-outline" size={64} color="#C7C7CC" />
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
    backgroundColor: "#F5F5F7",
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
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E3F2FD",
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
  dangerCard: {
    backgroundColor: "#FFEBEE",
  },
  safeCard: {
    backgroundColor: "#E8F5E9",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  dangerText: {
    color: "#D32F2F",
  },
  safeText: {
    color: "#4CAF50",
  },
  statLabel: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "600",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    height: 50,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1C1C1E",
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
    backgroundColor: "#E5E5EA",
  },
  filterButtonActive: {
    backgroundColor: "#0066CC",
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8E8E93",
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
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  scanHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#F5F5F7",
    marginRight: 12,
  },
  scanInfo: {
    flex: 1,
  },
  scanId: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0066CC",
    marginBottom: 4,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginBottom: 2,
  },
  patientId: {
    fontSize: 13,
    color: "#8E8E93",
    marginBottom: 6,
  },
  dateTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    color: "#8E8E93",
    marginRight: 8,
  },
  timeText: {
    fontSize: 12,
    color: "#8E8E93",
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
    backgroundColor: "#FFEBEE",
  },
  predictionSafe: {
    backgroundColor: "#E8F5E9",
  },
  predictionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
  },
  textDanger: {
    color: "#D32F2F",
  },
  textSafe: {
    color: "#4CAF50",
  },
  confidenceText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  clinicianRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F5F5F7",
  },
  clinicianText: {
    fontSize: 13,
    color: "#8E8E93",
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
    backgroundColor: "#E3F2FD",
    borderRadius: 8,
    paddingVertical: 10,
    gap: 6,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0066CC",
  },
  deleteIconButton: {
    width: 44,
    height: 44,
    backgroundColor: "#FFEBEE",
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
    color: "#8E8E93",
    marginTop: 16,
  },
});
