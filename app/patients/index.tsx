import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { patientsAPI } from "../../services/api.client";
import { Patient } from "../../types/api";
import { getErrorMessage } from "../../utils/errorHandler";
import { useToast } from "../../hooks/useToast";
import { COLORS, BORDER_RADIUS, SHADOWS, SPACING } from "../../constants/Theme";

export default function PatientsScreen() {
  const insets = useSafeAreaInsets();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { error: showError } = useToast();

  useEffect(() => {
    loadPatients();
  }, []);

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
      showError(getErrorMessage(error));
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
        <Ionicons name="person-circle" size={50} color={COLORS.primary} />
      </View>

      <View style={styles.patientInfo}>
        <Text style={styles.patientName}>{item.name}</Text>
        <Text style={styles.patientId}>ID: {item.idNumber}</Text>
        <View style={styles.patientMeta}>
          <Ionicons name="calendar-outline" size={12} color={COLORS.textTertiary} />
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

      <Ionicons name="chevron-forward" size={20} color={COLORS.textTertiary} />
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Ionicons name="person-outline" size={36} color={COLORS.textTertiary} />
      </View>
      <Text style={styles.emptyText}>
        {searchQuery ? "No patients found" : "No patients yet"}
      </Text>
      <Text style={styles.emptySubtext}>
        {searchQuery ? "Try a different search" : "Create your first patient record"}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top + 8 : 16 }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
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

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={COLORS.textTertiary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or ID..."
          placeholderTextColor={COLORS.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={18} color={COLORS.textTertiary} />
          </TouchableOpacity>
        )}
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.md,
    paddingBottom: 16,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...SHADOWS.light,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
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
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontWeight: "500",
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS.light,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: SPACING.md,
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 14,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    height: 46,
    gap: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: "500",
  },
  listContent: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    flexGrow: 1,
  },
  patientCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  avatarContainer: {
    marginRight: 12,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  patientId: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 6,
    fontWeight: "500",
  },
  patientMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: COLORS.textTertiary,
    fontWeight: "500",
  },
  scanBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 8,
  },
  scanBadgeText: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.primary,
  },
  scanBadgeLabel: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingTop: 80,
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
  emptyText: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: 8,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
