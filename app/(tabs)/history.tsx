import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { PremiumChip } from "../../components/premium";
import { scansAPI } from "../../services/api.client";
import { Scan } from "../../types/api";
import { formatDate, formatTime } from "../../utils/dateFormatter";

export default function HistoryScreen() {
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
    } catch (error) {
      console.error("Error loading scans:", error);
      Alert.alert("Error", "Failed to load scan history");
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
      console.error("Error refreshing scans:", error);
      Alert.alert("Error", "Failed to refresh scan history");
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

  const renderHistoryItem = ({ item }: { item: Scan }) => {
    const isPneumonia = item.result === "PNEUMONIA";

    return (
      <TouchableOpacity
        style={styles.historyCard}
        onPress={() =>
          router.push({
            pathname: "/report/[scanId]",
            params: { scanId: item.id },
          })
        }
      >
        <Image source={{ uri: item.imageUrl }} style={styles.thumbnail} />

        <View style={styles.historyInfo}>
          <View style={styles.historyHeader}>
            <Text style={styles.scanId}>{item.id}</Text>
            <View
              style={[
                styles.statusBadge,
                isPneumonia ? styles.statusDanger : styles.statusSafe,
              ]}
            >
              <Ionicons
                name={isPneumonia ? "warning" : "checkmark-circle"}
                size={12}
                color={isPneumonia ? "#D32F2F" : "#4CAF50"}
              />
            </View>
          </View>

          <Text style={styles.patientName}>
            {item.patient?.name || "Unknown"}
          </Text>
          <Text style={styles.patientId}>
            ID: {item.patient?.idNumber || "N/A"}
          </Text>

          <View style={styles.historyFooter}>
            <View style={styles.dateTime}>
              <Ionicons name="calendar-outline" size={12} color="#8E8E93" />
              <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
              <Ionicons name="time-outline" size={12} color="#8E8E93" />
              <Text style={styles.timeText}>{formatTime(item.createdAt)}</Text>
            </View>
            <Text style={styles.confidence}>
              {item.confidence?.toFixed(1)}%
            </Text>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#0066CC" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topSpacer} />

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{scans.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={[styles.statBox, styles.dangerBox]}>
          <Text style={[styles.statValue, styles.dangerText]}>
            {scans.filter((s) => s.result === "PNEUMONIA").length}
          </Text>
          <Text style={styles.statLabel}>Pneumonia</Text>
        </View>
        <View style={[styles.statBox, styles.safeBox]}>
          <Text style={[styles.statValue, styles.safeText]}>
            {scans.filter((s) => s.result === "NORMAL").length}
          </Text>
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
        <PremiumChip
          label="All"
          selected={filterStatus === "all"}
          onPress={() => setFilterStatus("all")}
        />
        <PremiumChip
          label="Pneumonia"
          selected={filterStatus === "PNEUMONIA"}
          onPress={() => setFilterStatus("PNEUMONIA")}
        />
        <PremiumChip
          label="Normal"
          selected={filterStatus === "NORMAL"}
          onPress={() => setFilterStatus("NORMAL")}
        />
      </View>

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
            <Ionicons name="folder-open-outline" size={64} color="#C7C7CC" />
            <Text style={styles.emptyText}>No scans found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFBFC",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  topSpacer: {
    height: 60,
  },
  statsContainer: {
    flexDirection: "row",
    padding: 20,
    paddingBottom: 16,
    gap: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  statBox: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  dangerBox: {
    backgroundColor: "rgba(239, 68, 68, 0.08)",
    borderColor: "#FECACA",
  },
  safeBox: {
    backgroundColor: "rgba(16, 185, 129, 0.08)",
    borderColor: "#A7F3D0",
  },
  statValue: {
    fontSize: 36,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  dangerText: {
    color: "#EF4444",
  },
  safeText: {
    color: "#10B981",
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    paddingHorizontal: 16,
    borderRadius: 14,
    height: 54,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
    color: "#9CA3AF",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
    fontWeight: "500",
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  historyCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    marginRight: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  historyInfo: {
    flex: 1,
  },
  historyHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  scanId: {
    fontSize: 12,
    color: "#0B5ED7",
    fontWeight: "800",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  statusBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  statusDanger: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
  },
  statusSafe: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
  },
  patientName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  patientId: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 10,
    fontWeight: "500",
  },
  historyFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateTime: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginRight: 10,
    fontWeight: "600",
  },
  timeText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "600",
  },
  confidence: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0B5ED7",
    letterSpacing: -0.3,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 16,
    color: "#9CA3AF",
    marginTop: 16,
    fontWeight: "500",
  },
});
