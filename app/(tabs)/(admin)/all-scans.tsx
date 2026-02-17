import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

// Mock scan data
const MOCK_SCANS = [
  {
    id: "SCAN-2024-001",
    patientName: "John Doe",
    patientId: "PT-12345",
    date: "2024-02-17",
    time: "14:30",
    prediction: "Pneumonia Detected",
    confidence: 94.5,
    clinician: "Dr. Sarah Johnson",
    imageUri: "https://via.placeholder.com/100x100/0066CC/FFFFFF?text=X-Ray",
  },
  {
    id: "SCAN-2024-002",
    patientName: "Jane Smith",
    patientId: "PT-12346",
    date: "2024-02-17",
    time: "13:15",
    prediction: "Normal",
    confidence: 88.2,
    clinician: "Dr. Michael Chen",
    imageUri: "https://via.placeholder.com/100x100/4CAF50/FFFFFF?text=X-Ray",
  },
  {
    id: "SCAN-2024-003",
    patientName: "Robert Johnson",
    patientId: "PT-12347",
    date: "2024-02-16",
    time: "16:45",
    prediction: "Pneumonia Detected",
    confidence: 91.8,
    clinician: "Dr. Emily Rodriguez",
    imageUri: "https://via.placeholder.com/100x100/0066CC/FFFFFF?text=X-Ray",
  },
  {
    id: "SCAN-2024-004",
    patientName: "Maria Garcia",
    patientId: "PT-12348",
    date: "2024-02-16",
    time: "11:20",
    prediction: "Normal",
    confidence: 92.4,
    clinician: "Dr. Sarah Johnson",
    imageUri: "https://via.placeholder.com/100x100/4CAF50/FFFFFF?text=X-Ray",
  },
  {
    id: "SCAN-2024-005",
    patientName: "David Lee",
    patientId: "PT-12349",
    date: "2024-02-15",
    time: "09:30",
    prediction: "Pneumonia Detected",
    confidence: 87.6,
    clinician: "Dr. James Wilson",
    imageUri: "https://via.placeholder.com/100x100/0066CC/FFFFFF?text=X-Ray",
  },
];

export default function AllScansScreen() {
  const [scans, setScans] = useState(MOCK_SCANS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "Pneumonia Detected" | "Normal"
  >("all");

  const filteredScans = scans.filter((scan) => {
    const matchesSearch =
      scan.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scan.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scan.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || scan.prediction === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const pneumoniaCount = scans.filter(
    (s) => s.prediction === "Pneumonia Detected"
  ).length;
  const normalCount = scans.filter((s) => s.prediction === "Normal").length;

  const handleDeleteScan = (scanId: string, patientName: string) => {
    Alert.alert(
      "Delete Scan",
      `Are you sure you want to delete scan for ${patientName}? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setScans(scans.filter((s) => s.id !== scanId));
            Alert.alert("Success", "Scan deleted successfully");
          },
        },
      ]
    );
  };

  const handleViewDetails = (scan: typeof MOCK_SCANS[0]) => {
    router.push({
      pathname: "/analysis/results/[scanId]",
      params: {
        scanId: scan.id,
        imageUri: scan.imageUri,
        patientId: scan.patientId,
        patientName: scan.patientName,
        age: "45",
        sex: "Male",
        scanDate: scan.date,
        prediction: scan.prediction,
        confidence: scan.confidence.toString(),
      },
    });
  };

  const renderScanCard = ({ item }: { item: typeof MOCK_SCANS[0] }) => {
    const isPneumonia = item.prediction === "Pneumonia Detected";

    return (
      <TouchableOpacity
        style={styles.scanCard}
        onPress={() => handleViewDetails(item)}
      >
        {/* Image & Quick Info */}
        <View style={styles.scanHeader}>
          <Image source={{ uri: item.imageUri }} style={styles.thumbnail} />
          <View style={styles.scanInfo}>
            <Text style={styles.scanId}>{item.id}</Text>
            <Text style={styles.patientName}>{item.patientName}</Text>
            <Text style={styles.patientId}>ID: {item.patientId}</Text>
            <View style={styles.dateTimeRow}>
              <Ionicons name="calendar-outline" size={12} color="#8E8E93" />
              <Text style={styles.dateText}>{item.date}</Text>
              <Ionicons name="time-outline" size={12} color="#8E8E93" />
              <Text style={styles.timeText}>{item.time}</Text>
            </View>
          </View>
        </View>

        {/* Prediction Badge */}
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
            {item.prediction}
          </Text>
          <Text style={styles.confidenceText}>
            {item.confidence.toFixed(1)}%
          </Text>
        </View>

        {/* Clinician Info */}
        <View style={styles.clinicianRow}>
          <Ionicons name="person-circle-outline" size={16} color="#8E8E93" />
          <Text style={styles.clinicianText}>Analyzed by {item.clinician}</Text>
        </View>

        {/* Action Buttons */}
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
            onPress={() => handleDeleteScan(item.id, item.patientName)}
          >
            <Ionicons name="trash-outline" size={18} color="#D32F2F" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Stats Cards */}
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

      {/* Filter Buttons */}
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
            filterStatus === "Pneumonia Detected" && styles.filterButtonActive,
          ]}
          onPress={() => setFilterStatus("Pneumonia Detected")}
        >
          <Text
            style={[
              styles.filterButtonText,
              filterStatus === "Pneumonia Detected" &&
                styles.filterButtonTextActive,
            ]}
          >
            Pneumonia ({pneumoniaCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filterStatus === "Normal" && styles.filterButtonActive,
          ]}
          onPress={() => setFilterStatus("Normal")}
        >
          <Text
            style={[
              styles.filterButtonText,
              filterStatus === "Normal" && styles.filterButtonTextActive,
            ]}
          >
            Normal ({normalCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Scans List */}
      <FlatList
        data={filteredScans}
        renderItem={renderScanCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-outline" size={64} color="#C7C7CC" />
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