import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Mock history data
const MOCK_HISTORY = [
  {
    id: "SCAN-2024-001",
    patientName: "John Doe",
    patientId: "PT-12345",
    date: "2024-02-17",
    time: "14:30",
    prediction: "Pneumonia Detected",
    confidence: 94.5,
    imageUri: "https://via.placeholder.com/80x80/0066CC/FFFFFF?text=X-Ray",
  },
  {
    id: "SCAN-2024-002",
    patientName: "Jane Smith",
    patientId: "PT-12346",
    date: "2024-02-17",
    time: "13:15",
    prediction: "Normal",
    confidence: 88.2,
    imageUri: "https://via.placeholder.com/80x80/4CAF50/FFFFFF?text=X-Ray",
  },
  {
    id: "SCAN-2024-003",
    patientName: "Robert Johnson",
    patientId: "PT-12347",
    date: "2024-02-16",
    time: "16:45",
    prediction: "Pneumonia Detected",
    confidence: 91.8,
    imageUri: "https://via.placeholder.com/80x80/0066CC/FFFFFF?text=X-Ray",
  },
  {
    id: "SCAN-2024-004",
    patientName: "Maria Garcia",
    patientId: "PT-12348",
    date: "2024-02-16",
    time: "11:20",
    prediction: "Normal",
    confidence: 92.4,
    imageUri: "https://via.placeholder.com/80x80/4CAF50/FFFFFF?text=X-Ray",
  },
  {
    id: "SCAN-2024-005",
    patientName: "David Lee",
    patientId: "PT-12349",
    date: "2024-02-15",
    time: "09:30",
    prediction: "Pneumonia Detected",
    confidence: 87.6,
    imageUri: "https://via.placeholder.com/80x80/0066CC/FFFFFF?text=X-Ray",
  },
];

export default function HistoryScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "Pneumonia Detected" | "Normal"
  >("all");

  const filteredHistory = MOCK_HISTORY.filter((item) => {
    const matchesSearch =
      item.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || item.prediction === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const renderHistoryItem = ({ item }: { item: typeof MOCK_HISTORY[0] }) => {
    const isPneumonia = item.prediction === "Pneumonia Detected";

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
        <Image source={{ uri: item.imageUri }} style={styles.thumbnail} />

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

          <Text style={styles.patientName}>{item.patientName}</Text>
          <Text style={styles.patientId}>ID: {item.patientId}</Text>

          <View style={styles.historyFooter}>
            <View style={styles.dateTime}>
              <Ionicons name="calendar-outline" size={12} color="#8E8E93" />
              <Text style={styles.dateText}>{item.date}</Text>
              <Ionicons name="time-outline" size={12} color="#8E8E93" />
              <Text style={styles.timeText}>{item.time}</Text>
            </View>
            <Text style={styles.confidence}>{item.confidence}%</Text>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Stats Summary */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{MOCK_HISTORY.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={[styles.statBox, styles.dangerBox]}>
          <Text style={[styles.statValue, styles.dangerText]}>
            {MOCK_HISTORY.filter((s) => s.prediction === "Pneumonia Detected").length}
          </Text>
          <Text style={styles.statLabel}>Pneumonia</Text>
        </View>
        <View style={[styles.statBox, styles.safeBox]}>
          <Text style={[styles.statValue, styles.safeText]}>
            {MOCK_HISTORY.filter((s) => s.prediction === "Normal").length}
          </Text>
          <Text style={styles.statLabel}>Normal</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
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

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, filterStatus === "all" && styles.filterTabActive]}
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
            filterStatus === "Pneumonia Detected" && styles.filterTabActive,
          ]}
          onPress={() => setFilterStatus("Pneumonia Detected")}
        >
          <Text
            style={[
              styles.filterText,
              filterStatus === "Pneumonia Detected" && styles.filterTextActive,
            ]}
          >
            Pneumonia
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterTab,
            filterStatus === "Normal" && styles.filterTabActive,
          ]}
          onPress={() => setFilterStatus("Normal")}
        >
          <Text
            style={[
              styles.filterText,
              filterStatus === "Normal" && styles.filterTextActive,
            ]}
          >
            Normal
          </Text>
        </TouchableOpacity>
      </View>

      {/* History List */}
      <FlatList
        data={filteredHistory}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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