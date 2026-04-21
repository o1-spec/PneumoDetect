import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { patientsAPI, scansAPI } from "../../services/api.client";
import { Patient, Scan, ScanStatus } from "../../types/api";
import { getErrorMessage } from "../../utils/errorHandler";
import { useToast } from "../../hooks/useToast";

const STATUS_COLORS: Record<ScanStatus, string> = {
  UPLOADED: "#FFA500",
  PROCESSING: "#1E90FF",
  COMPLETED: "#4CAF50",
  FAILED: "#D32F2F",
};

const STATUS_ICONS: Record<ScanStatus, string> = {
  UPLOADED: "cloud-upload",
  PROCESSING: "sync",
  COMPLETED: "checkmark-circle",
  FAILED: "close-circle",
};

export default function PatientDetailScreen() {
  const { patientId } = useLocalSearchParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { error: showError } = useToast();

  useEffect(() => {
    loadPatientData();
  }, [patientId]);

  const loadPatientData = async () => {
    try {
      setLoading(true);
      const [patientData, scansData] = await Promise.all([
        patientsAPI.getById(patientId as string),
        scansAPI.getByPatientId(patientId as string),
      ]);

      setPatient(patientData);
      setScans(scansData);
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await loadPatientData();
    } finally {
      setRefreshing(false);
    }
  };

  const handleUploadScan = () => {
    router.push({
      pathname: "/analysis/upload",
      params: { patientId },
    });
  };

  const handleScanPress = (scanId: string) => {
    router.push({
      pathname: "/analysis/results/[scanId]",
      params: { scanId },
    });
  };

  const getGenderDisplay = (gender: string): string => {
    return gender === "MALE" ? "Male" : "Female";
  };

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderScanItem = ({ item }: { item: Scan }) => (
    <TouchableOpacity
      style={styles.scanCard}
      onPress={() => handleScanPress(item.id)}
    >
      <View style={styles.scanHeader}>
        <View style={styles.scanIcon}>
          <Ionicons
            name={STATUS_ICONS[item.status] as any}
            size={20}
            color={STATUS_COLORS[item.status]}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.scanTitle}>Chest X-ray Scan</Text>
          <Text style={styles.scanDate}>{formatDate(item.createdAt)}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: `${STATUS_COLORS[item.status]}20` },
          ]}
        >
          <Text
            style={[
              styles.statusBadgeText,
              { color: STATUS_COLORS[item.status] },
            ]}
          >
            {item.status}
          </Text>
        </View>
      </View>

      {item.result && (
        <View style={styles.resultSection}>
          <Text style={styles.resultLabel}>Result:</Text>
          <Text
            style={[
              styles.resultValue,
              {
                color: item.result === "PNEUMONIA" ? "#D32F2F" : "#4CAF50",
              },
            ]}
          >
            {item.result === "PNEUMONIA" ? "⚠ Pneumonia Detected" : "✓ Normal"}
          </Text>
          {item.confidence && (
            <Text style={styles.confidenceText}>
              Confidence: {(item.confidence * 100).toFixed(1)}%
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );

  const EmptyScansView = () => (
    <View style={styles.emptyState}>
      <Ionicons name="document-outline" size={48} color="#C7C7CC" />
      <Text style={styles.emptyText}>No scans yet</Text>
      <Text style={styles.emptySubtext}>
        Upload a chest X-ray to get started
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#0066CC" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Patient Details</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (!patient) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#0066CC" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Patient Details</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Patient not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#0066CC" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Patient Details</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        style={styles.content}
        data={scans}
        renderItem={renderScanItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <View style={styles.patientCard}>
              <View style={styles.patientHeader}>
                <View style={styles.patientAvatar}>
                  <Ionicons name="person" size={32} color="#0066CC" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.patientName}>{patient.name}</Text>
                  <Text style={styles.patientId}>{patient.idNumber}</Text>
                </View>
              </View>

              <View style={styles.patientDetails}>
                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Age</Text>
                    <Text style={styles.detailValue}>{patient.age}</Text>
                  </View>
                  <View
                    style={[
                      styles.detailItem,
                      {
                        borderLeftWidth: 1,
                        borderLeftColor: "#E5E5EA",
                        paddingLeft: 16,
                      },
                    ]}
                  >
                    <Text style={styles.detailLabel}>Gender</Text>
                    <Text style={styles.detailValue}>
                      {getGenderDisplay(patient.gender)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{scans.length}</Text>
                <Text style={styles.statLabel}>Total Scans</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>
                  {scans.filter((s) => s.status === "COMPLETED").length}
                </Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>
                  {
                    scans.filter(
                      (s) =>
                        s.result === "PNEUMONIA" && s.status === "COMPLETED",
                    ).length
                  }
                </Text>
                <Text style={styles.statLabel}>Positive</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handleUploadScan}
            >
              <Ionicons name="cloud-upload" size={20} color="#FFFFFF" />
              <Text style={styles.uploadButtonText}>Upload New Scan</Text>
            </TouchableOpacity>

            {scans.length > 0 && (
              <Text style={styles.sectionTitle}>Scan History</Text>
            )}
          </>
        }
        ListEmptyComponent={EmptyScansView}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  flatListContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#8E8E93",
  },
  patientCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 16,
  },
  patientHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  patientAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
  },
  patientName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  patientId: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 4,
  },
  patientDetails: {
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    paddingTop: 16,
  },
  detailRow: {
    flexDirection: "row",
    gap: 16,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: "#8E8E93",
    textTransform: "uppercase",
    fontWeight: "600",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0066CC",
  },
  statLabel: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 4,
  },
  uploadButton: {
    flexDirection: "row",
    backgroundColor: "#0066CC",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 20,
  },
  uploadButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginBottom: 12,
  },
  scanCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  scanHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  scanIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F5F5F7",
    justifyContent: "center",
    alignItems: "center",
  },
  scanTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  scanDate: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  resultSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    gap: 4,
  },
  resultLabel: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "600",
  },
  resultValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  confidenceText: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 4,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#8E8E93",
  },
});
