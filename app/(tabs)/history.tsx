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
        <TouchableOpacity
          style={[
            styles.filterTab,
            filterStatus === "all" && styles.filterTabActive,
          ]}
          onPress={() => setFilterStatus("all")}
        >
          <Text
            style={[
              styles.filterText,
              filterStatus === "all" && styles.filterTextActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterTab,
            filterStatus === "PNEUMONIA" && styles.filterTabActive,
          ]}
          onPress={() => setFilterStatus("PNEUMONIA")}
        >
          <Text
            style={[
              styles.filterText,
              filterStatus === "PNEUMONIA" && styles.filterTextActive,
            ]}
          >
            Pneumonia
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterTab,
            filterStatus === "NORMAL" && styles.filterTabActive,
          ]}
          onPress={() => setFilterStatus("NORMAL")}
        >
          <Text
            style={[
              styles.filterText,
              filterStatus === "NORMAL" && styles.filterTextActive,
            ]}
          >
            Normal
          </Text>
        </TouchableOpacity>
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
    backgroundColor: "#F5F5F7",
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
    padding: 16,
    gap: 12,
  },
  statBox: {
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
  dangerBox: {
    backgroundColor: "#FFEBEE",
  },
  safeBox: {
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
  filterTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#E5E5EA",
  },
  filterTabActive: {
    backgroundColor: "#0066CC",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8E8E93",
  },
  filterTextActive: {
    color: "#FFFFFF",
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  historyCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: "#F5F5F7",
    marginRight: 12,
  },
  historyInfo: {
    flex: 1,
  },
  historyHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  scanId: {
    fontSize: 11,
    color: "#0066CC",
    fontWeight: "600",
  },
  statusBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  statusDanger: {
    backgroundColor: "#FFEBEE",
  },
  statusSafe: {
    backgroundColor: "#E8F5E9",
  },
  patientName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginBottom: 2,
  },
  patientId: {
    fontSize: 12,
    color: "#8E8E93",
    marginBottom: 8,
  },
  historyFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateTime: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dateText: {
    fontSize: 11,
    color: "#8E8E93",
    marginRight: 8,
  },
  timeText: {
    fontSize: 11,
    color: "#8E8E93",
  },
  confidence: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0066CC",
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
