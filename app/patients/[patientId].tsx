import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { patientsAPI, scansAPI } from "../../services/api.client";
import { Patient, Scan, ScanStatus } from "../../types/api";
import { getErrorMessage } from "../../utils/errorHandler";
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
      <Text style={{ fontSize: 8, color: "#64748B", marginTop: 4, fontWeight: "600", textAlign: "center" }}>
        No Scan
      </Text>
    </View>
  );
};

export default function PatientDetailScreen() {
  const { patientId } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
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
      
      // Sort scans chronologically (most recent first)
      const sortedScans = Array.isArray(scansData) 
        ? [...scansData].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        : [];
      setScans(sortedScans);
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

  const handleScanPress = (scan: Scan) => {
    router.push({
      pathname: "/analysis/results/[scanId]",
      params: {
        scanId: scan.id,
        imageUri: scan.imageUrl || "",
        patientId: patient?.idNumber || "N/A",
        patientName: patient?.name || "Unknown Patient",
        age: patient?.age?.toString() || "N/A",
        sex: patient?.gender === "MALE" ? "Male" : "Female",
        scanDate: new Date(scan.createdAt).toLocaleDateString(),
        result: scan.result || "NORMAL",
        confidence: (scan.confidence || 0).toString(),
        heatmapUrl: scan.heatmapUrl || "",
      }
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
    });
  };

  const getConfidenceLabel = (conf: number) => {
    if (conf >= 90) return "High Confidence";
    if (conf >= 70) return "Moderate Confidence";
    return "Low Confidence";
  };

  const renderScanItem = ({ item, index }: { item: Scan; index: number }) => {
    const isPneumonia = item.result === "PNEUMONIA";
    const isLast = index === scans.length - 1;

    return (
      <View style={styles.timelineRow}>
        {/* Timeline Indicator Line & Dots */}
        <View style={styles.timelineIndicators}>
          <View style={[
            styles.timelineDot,
            isPneumonia ? styles.dotDanger : styles.dotSuccess
          ]} />
          {!isLast && <View style={styles.timelineLine} />}
        </View>

        {/* Timeline Case Content Card */}
        <TouchableOpacity
          style={styles.scanCard}
          onPress={() => handleScanPress(item)}
        >
          <View style={styles.scanHeader}>
            <XrayThumbnail uri={item.imageUrl} width={64} height={64} />
            
            <View style={styles.scanTextInfo}>
              <View style={styles.scanDateRow}>
                <Text style={styles.scanTitle}>Chest X-Ray Projective</Text>
                <Text style={styles.scanDate}>{formatDate(item.createdAt)}</Text>
              </View>
              
              <View style={styles.scanResultRow}>
                <View style={[
                  styles.resultBadge,
                  isPneumonia ? styles.badgeDanger : styles.badgeSuccess
                ]}>
                  <Text style={[
                    styles.resultText,
                    isPneumonia ? styles.textDanger : styles.textSuccess
                  ]}>
                    {isPneumonia ? "Pneumonia Suspected" : "Normal"}
                  </Text>
                </View>
                {item.confidence && (
                  <Text style={styles.scanConfidence}>
                    {item.confidence.toFixed(0)}% • <Text style={styles.confidenceLabelSub}>
                      {getConfidenceLabel(item.confidence)}
                    </Text>
                  </Text>
                )}
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color={COLORS.textTertiary} />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const EmptyScansView = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconBox}>
        <Ionicons name="images-outline" size={48} color={COLORS.textTertiary} />
      </View>
      <Text style={styles.emptyText}>No clinical scans found</Text>
      <Text style={styles.emptySubtext}>
        Upload a chest X-ray to start the EMR progression history
      </Text>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top + 8 : 16 }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Patient EMR</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading details...</Text>
        </View>
      </View>
    );
  }

  if (!patient) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top + 8 : 16 }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Patient EMR</Text>
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
      {/* Top Header */}
      <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top + 8 : 16 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Patient EMR</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        style={styles.content}
        data={scans}
        renderItem={renderScanItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            {/* Patient Credentials Card */}
            <View style={styles.patientCard}>
              <View style={styles.patientHeader}>
                <View style={styles.patientAvatar}>
                  <Ionicons name="person-outline" size={28} color={COLORS.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.patientName}>{patient.name}</Text>
                  <Text style={styles.patientId}>Record ID: {patient.idNumber}</Text>
                </View>
              </View>

              <View style={styles.patientDetails}>
                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Age</Text>
                    <Text style={styles.detailValue}>{patient.age} yrs</Text>
                  </View>
                  <View
                    style={[
                      styles.detailItem,
                      {
                        borderLeftWidth: 1,
                        borderLeftColor: COLORS.border,
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

            {/* Quick Summary Grid */}
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
                <Text style={[styles.statNumber, styles.textDanger]}>
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

            {/* Action Trigger */}
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handleUploadScan}
            >
              <Ionicons name="add" size={20} color="#FFFFFF" />
              <Text style={styles.uploadButtonText}>Analyze New Scan</Text>
            </TouchableOpacity>

            {scans.length > 0 && (
              <Text style={styles.sectionTitle}>Disease Progression Timeline</Text>
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
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...SHADOWS.light,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
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
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  patientCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
    ...SHADOWS.light,
  },
  patientHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  patientAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  patientName: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  patientId: {
    fontSize: 13,
    color: COLORS.textTertiary,
    marginTop: 4,
    fontWeight: "600",
  },
  patientDetails: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 16,
    marginTop: 16,
  },
  detailRow: {
    flexDirection: "row",
    gap: 16,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    color: COLORS.textTertiary,
    textTransform: "uppercase",
    fontWeight: "700",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontWeight: "600",
  },
  uploadButton: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginBottom: 24,
    ...SHADOWS.light,
  },
  uploadButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 16,
    letterSpacing: -0.2,
  },
  timelineRow: {
    flexDirection: "row",
    minHeight: 100,
  },
  timelineIndicators: {
    width: 24,
    alignItems: "center",
    marginRight: 10,
  },
  timelineDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.primary,
    zIndex: 10,
    marginTop: 24,
  },
  dotDanger: {
    backgroundColor: COLORS.danger,
    borderWidth: 2.5,
    borderColor: COLORS.dangerLight,
  },
  dotSuccess: {
    backgroundColor: COLORS.success,
    borderWidth: 2.5,
    borderColor: COLORS.successLight,
  },
  timelineLine: {
    width: 2,
    position: "absolute",
    top: 36,
    bottom: 0,
    backgroundColor: COLORS.border,
    zIndex: 5,
  },
  scanCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  scanHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  scanTextInfo: {
    flex: 1,
  },
  scanDateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scanTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  scanDate: {
    fontSize: 11,
    color: COLORS.textTertiary,
    fontWeight: "600",
  },
  scanResultRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 8,
  },
  resultBadge: {
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
  resultText: {
    fontSize: 10,
    fontWeight: "800",
  },
  textDanger: {
    color: COLORS.danger,
  },
  textSuccess: {
    color: COLORS.success,
  },
  scanConfidence: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: "700",
  },
  confidenceLabelSub: {
    color: COLORS.primary,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
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
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  emptySubtext: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: "center",
    fontWeight: "600",
    marginTop: 4,
  },
});
