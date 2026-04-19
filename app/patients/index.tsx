import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { patientsAPI } from "../../services/api.client";
import { Patient } from "../../types/api";
import { getErrorMessage } from "../../utils/errorHandler";

export default function PatientsScreen() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load patients on mount
  useEffect(() => {
    loadPatients();
  }, []);

  // Filter patients based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = patients.filter(
        (patient) =>
          patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          patient.idNumber.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients(patients);
    }
  }, [searchQuery, patients]);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const data = await patientsAPI.getAll();
      setPatients(data);
    } catch (error) {
      Alert.alert("Error", getErrorMessage(error));
      console.error("Failed to load patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await loadPatients();
    } finally {
      setRefreshing(false);
    }
  }, []);

  const renderPatientCard = ({ item }: { item: Patient }) => (
    <TouchableOpacity
      style={styles.patientCard}
      onPress={() =>
        router.push({
          pathname: "/patients/[patientId]" as any,
          params: { patientId: item.id },
        })
      }
    >
      <View style={styles.avatarContainer}>
        <Ionicons name="person-circle" size={50} color="#0066CC" />
      </View>

      <View style={styles.patientInfo}>
        <Text style={styles.patientName}>{item.name}</Text>
        <Text style={styles.patientId}>ID: {item.idNumber}</Text>
        <View style={styles.patientMeta}>
          <Ionicons name="calendar-outline" size={12} color="#8E8E93" />
          <Text style={styles.metaText}>{item.age} years old</Text>
          <Text style={styles.metaText}>• {item.gender}</Text>
        </View>
      </View>

      {item.scans && item.scans.length > 0 && (
        <View style={styles.scanBadge}>
          <Text style={styles.scanBadgeText}>{item.scans.length}</Text>
          <Text style={styles.scanBadgeLabel}>Scans</Text>
        </View>
      )}

      <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="person-outline" size={64} color="#C7C7CC" />
      <Text style={styles.emptyText}>
        {searchQuery ? "No patients found" : "No patients yet"}
      </Text>
      <Text style={styles.emptySubtext}>
        {searchQuery ? "Try a different search" : "Create your first patient"}
      </Text>
    </View>
  );

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
          <View>
            <Text style={styles.headerTitle}>Patients</Text>
            <Text style={styles.headerSubtitle}>
              {filteredPatients.length} patient
              {filteredPatients.length !== 1 ? "s" : ""}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/patients/create" as any)}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
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
          placeholder="Search by name or ID..."
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

      <FlatList
        data={filteredPatients}
        renderItem={renderPatientCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {loading && !refreshing && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <Text style={styles.loadingText}>Loading patients...</Text>
          </View>
        </View>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  backButton: {
    padding: 8,
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
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#0066CC",
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#F5F5F7",
    borderRadius: 12,
    height: 44,
    gap: 8,
  },
  searchIcon: {
    marginRight: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1C1C1E",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexGrow: 1,
  },
  patientCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarContainer: {
    marginRight: 12,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  patientId: {
    fontSize: 13,
    color: "#8E8E93",
    marginBottom: 6,
  },
  patientMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: "#8E8E93",
  },
  scanBadge: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 8,
  },
  scanBadgeText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0066CC",
  },
  scanBadgeLabel: {
    fontSize: 10,
    color: "#0066CC",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginTop: 16,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 8,
    textAlign: "center",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingBox: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
  },
  loadingText: {
    fontSize: 14,
    color: "#1C1C1E",
    fontWeight: "500",
  },
});
