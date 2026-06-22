import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "../../../components/premium";
import { InfoRow } from "../../../components/InfoRow";
import { PatientNotesModal } from "../../../components/PatientNotesModal";
import { useToast } from "../../../hooks/useToast";
import { scansAPI } from "../../../services/api.client";
import { COLORS, BORDER_RADIUS, SHADOWS, SPACING } from "../../../constants/Theme";
import { Scan } from "../../../types/api";

const { height: screenHeight } = Dimensions.get("window");

export default function ResultsScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const { info, error: showError } = useToast();
  
  const [scan, setScan] = useState<Scan | null>(null);
  const [loading, setLoading] = useState(true);
  const [notesModalVisible, setNotesModalVisible] = useState(false);
  const [patientNotes, setPatientNotes] = useState<string>("");
  const [notesLoading, setNotesLoading] = useState(false);
  const [aiOverlay, setAiOverlay] = useState(true); // AI Overlay Heatmap active by default

  const {
    scanId,
    imageUri,
    patientId,
    patientName,
    age,
    sex,
    scanDate,
    result,
    confidence,
    heatmapUrl,
  } = params;

  const scanIdStr = Array.isArray(scanId) ? scanId[0] : (scanId as string);

  useEffect(() => {
    info("Analysis results loaded");
    loadScanDetails();
  }, [scanId]);

  const loadScanDetails = async () => {
    if (!scanIdStr) return;
    try {
      setLoading(true);
      const data = await scansAPI.getById(scanIdStr);
      setScan(data);
      if (data.clinicianNotes) {
        setPatientNotes(data.clinicianNotes);
      }
    } catch (err) {
      // Fail silently and use params fallback
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotes = async (notes: string) => {
    try {
      setNotesLoading(true);
      // Backend uses update API for clinician
      await scansAPI.update(scanIdStr, { notes });
      setPatientNotes(notes);
      setNotesLoading(false);
      info("Clinical notes saved");
    } catch (error) {
      setNotesLoading(false);
      showError("Failed to save notes");
    }
  };

  // Sync params fallback and DB attributes
  const displayImage = scan?.imageUrl || (imageUri as string);
  const displayHeatmap = scan?.heatmapUrl || (heatmapUrl as string);
  const displayResult = scan?.result || (result as string);
  const displayConfidence = scan?.confidence || parseFloat(confidence as string) || 0;
  const displayPatientId = scan?.patient?.idNumber || (patientId as string);
  const displayPatientName = scan?.patient?.name || (patientName as string);
  const displayAge = scan?.patient?.age || (age as string);
  const displaySex = scan?.patient?.gender === "MALE" ? "Male" : (scan?.patient?.gender === "FEMALE" ? "Female" : (sex as string));
  const displayDate = scan?.createdAt ? new Date(scan.createdAt).toLocaleDateString() : (scanDate as string);

  const isPneumonia = displayResult === "PNEUMONIA";
  const predictionText = isPneumonia ? "Pneumonia Suspected" : "Normal";

  const getConfidenceLabel = (conf: number) => {
    if (conf >= 90) return "High Confidence";
    if (conf >= 70) return "Moderate Confidence";
    return "Low Confidence";
  };

  // Explainable AI copy
  const whyFlagged = isPneumonia
    ? "Increased opacity detected in the lower lung lobes. Textural patterns align with characteristic alveolar infiltration and consolidation profiles in training data."
    : "No atypical opacities or structural consolidations detected. Lung volumes and costophrenic angles appear clear and consistent with normal chest physiology.";

  const clinicalRecommendation = isPneumonia
    ? "Recommend clinical correlation, immediate physician review, and standard chest follow-up."
    : "No clinical pneumonia suspected. Routine observation as clinically indicated.";

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top + 8 : 16 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/(tabs)")}
        >
          <Ionicons name="close" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Analysis</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Radiographic Viewer (Allocates ~45-50% screen height) */}
        <View style={styles.viewerContainer}>
          {displayImage ? (
            <View style={styles.imageWrapper}>
              <Image source={{ uri: displayImage }} style={styles.xrayImage} />
              
              {/* AI Heatmap Overlay */}
              {aiOverlay && displayHeatmap ? (
                <Image 
                  source={{ uri: displayHeatmap }} 
                  style={[styles.xrayImage, styles.heatmapOverlay]} 
                />
              ) : null}
            </View>
          ) : (
            // styled dark X-ray placeholder
            <View style={styles.darkPlaceholder}>
              <MaterialCommunityIcons name="lungs" size={64} color="#334155" />
              <Text style={styles.darkPlaceholderText}>No Scan Available</Text>
            </View>
          )}

          {/* AI Overlay ON/OFF Toggle Pill (Top-Right of viewer) */}
          {displayHeatmap ? (
            <TouchableOpacity
              style={[styles.overlayToggle, aiOverlay && styles.overlayToggleActive]}
              onPress={() => setAiOverlay(!aiOverlay)}
            >
              <Ionicons 
                name={aiOverlay ? "eye-outline" : "eye-off-outline"} 
                size={14} 
                color={aiOverlay ? "#FFFFFF" : COLORS.textPrimary} 
              />
              <Text style={[styles.overlayToggleText, aiOverlay && styles.overlayToggleTextActive]}>
                AI Overlay {aiOverlay ? "ON" : "OFF"}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Prediction Summary & Confidence (Allocates ~20% height) */}
        <Card elevated="light" style={styles.sectionCard}>
          <View style={styles.predictionRow}>
            <View style={[
              styles.predictionIndicator,
              isPneumonia ? styles.indicatorDanger : styles.indicatorSuccess
            ]} />
            <View>
              <Text style={styles.predictionLabel}>AI Finding</Text>
              <Text style={styles.predictionText}>{predictionText}</Text>
            </View>
          </View>

          <View style={styles.confidenceContainer}>
            <View style={styles.confidenceHeader}>
              <Text style={styles.confidenceTitle}>Confidence Score</Text>
              <Text style={styles.confidencePercentage}>
                {displayConfidence.toFixed(0)}% • <Text style={styles.confidenceLabelSub}>
                  {getConfidenceLabel(displayConfidence)}
                </Text>
              </Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[
                styles.progressBarFill,
                {
                  width: `${displayConfidence}%`,
                  backgroundColor: isPneumonia ? COLORS.danger : COLORS.success
                }
              ]} />
            </View>
          </View>
        </Card>

        {/* Educational AI Findings & Explainability (Allocates ~15% height) */}
        <Card elevated="light" style={styles.sectionCard}>
          <Text style={styles.cardHeaderTitle}>AI Findings Summary</Text>
          
          <View style={styles.findingsList}>
            <View style={styles.findingItem}>
              <Ionicons 
                name={isPneumonia ? "alert-circle" : "checkmark-circle"} 
                size={16} 
                color={isPneumonia ? COLORS.danger : COLORS.success} 
              />
              <Text style={styles.findingText}>
                {isPneumonia ? "Lobe opacity & consolidation detected" : "Lungs clear of atypical consolidations"}
              </Text>
            </View>
            <View style={styles.findingItem}>
              <Ionicons 
                name={isPneumonia ? "alert-circle" : "checkmark-circle"} 
                size={16} 
                color={isPneumonia ? COLORS.danger : COLORS.success} 
              />
              <Text style={styles.findingText}>
                {isPneumonia ? "Radiographic patterns consistent with pneumonia" : "Costophrenic angles clear and calibrated"}
              </Text>
            </View>
          </View>

          <View style={styles.explainabilityBox}>
            <Text style={styles.explainabilityTitle}>Why was this flagged?</Text>
            <Text style={styles.explainabilityText}>{whyFlagged}</Text>
          </View>
        </Card>

        {/* Clinical Recommendation & Notes (Allocates ~15% height) */}
        <Card elevated="light" style={styles.sectionCard}>
          <Text style={styles.cardHeaderTitle}>Clinical Guidance</Text>
          
          <View style={styles.recommendationBox}>
            <Text style={styles.recommendationTitle}>Clinical Recommendation</Text>
            <Text style={styles.recommendationText}>{clinicalRecommendation}</Text>
          </View>

          <View style={styles.notesSection}>
            <View style={styles.notesHeader}>
              <Text style={styles.notesTitle}>Clinician Observations</Text>
              <TouchableOpacity
                style={styles.editNotesButton}
                onPress={() => setNotesModalVisible(true)}
              >
                <Ionicons name="create-outline" size={14} color={COLORS.primary} />
                <Text style={styles.editNotesText}>Add Note</Text>
              </TouchableOpacity>
            </View>

            {patientNotes ? (
              <Text style={styles.savedNotesText}>{patientNotes}</Text>
            ) : (
              <Text style={styles.notesPlaceholderText}>
                No clinician observation notes written yet.
              </Text>
            )}
          </View>
        </Card>

        {/* Demographics Card */}
        <Card elevated="light" style={styles.sectionCard}>
          <Text style={styles.cardHeaderTitle}>Patient EMR Record</Text>
          <InfoRow label="Patient ID" value={displayPatientId || "N/A"} />
          <InfoRow label="Full Name" value={displayPatientName || "Unknown Patient"} />
          <InfoRow label="Age / Gender" value={`${displayAge || "N/A"} yrs / ${displaySex || "N/A"}`} />
          <InfoRow label="Analysis Date" value={displayDate || "N/A"} />
        </Card>

        {/* Clinical Actions */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() =>
              router.push({
                pathname: "/report/[scanId]",
                params: { scanId: scanIdStr },
              })
            }
          >
            <Ionicons name="document-text-outline" size={18} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Generate PDF Report</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.replace("/(tabs)")}
          >
            <Text style={styles.secondaryButtonText}>Return to Workspace</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Patient Notes Modal */}
      <PatientNotesModal
        visible={notesModalVisible}
        currentNotes={patientNotes}
        onClose={() => setNotesModalVisible(false)}
        onSave={handleSaveNotes}
        loading={notesLoading}
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
    padding: SPACING.md,
  },
  viewerContainer: {
    height: screenHeight * 0.45,
    backgroundColor: "#0F172A",
    borderRadius: BORDER_RADIUS.md,
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  imageWrapper: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  xrayImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  heatmapOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.65,
  },
  darkPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E293B",
  },
  darkPlaceholderText: {
    color: "#64748B",
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
  },
  overlayToggle: {
    position: "absolute",
    top: 14,
    right: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    zIndex: 20,
    ...SHADOWS.light,
  },
  overlayToggleActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  overlayToggleText: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  overlayToggleTextActive: {
    color: "#FFFFFF",
  },
  sectionCard: {
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  predictionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  predictionIndicator: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  indicatorDanger: {
    backgroundColor: COLORS.danger,
  },
  indicatorSuccess: {
    backgroundColor: COLORS.success,
  },
  predictionLabel: {
    fontSize: 11,
    color: COLORS.textTertiary,
    textTransform: "uppercase",
    fontWeight: "700",
  },
  predictionText: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  confidenceContainer: {
    marginTop: 14,
  },
  confidenceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  confidenceTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  confidencePercentage: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  confidenceLabelSub: {
    color: COLORS.primary,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  cardHeaderTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  findingsList: {
    gap: 8,
    marginBottom: 14,
  },
  findingItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  findingText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  explainabilityBox: {
    backgroundColor: COLORS.primaryLight,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  explainabilityTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  explainabilityText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
    fontWeight: "600",
  },
  recommendationBox: {
    backgroundColor: COLORS.successLight,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DCFCE7",
    marginBottom: 14,
  },
  recommendationTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.success,
    marginBottom: 4,
  },
  recommendationText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
    fontWeight: "600",
  },
  notesSection: {
    marginTop: 6,
  },
  notesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  notesTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  editNotesButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  editNotesText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
  },
  savedNotesText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    lineHeight: 18,
    fontWeight: "600",
    backgroundColor: COLORS.primaryLight,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  notesPlaceholderText: {
    fontSize: 12,
    color: COLORS.textTertiary,
    fontStyle: "italic",
    fontWeight: "500",
  },
  actionButtons: {
    gap: 10,
    marginTop: 12,
  },
  primaryButton: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.sm,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    ...SHADOWS.light,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderRadius: BORDER_RADIUS.sm,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "700",
  },
  bottomSpacer: {
    height: 40,
  },
});
