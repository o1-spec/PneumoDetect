import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
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

export default function ResultsScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const { info } = useToast();
  const [notesModalVisible, setNotesModalVisible] = useState(false);
  const [patientNotes, setPatientNotes] = useState<string>("");
  const [notesLoading, setNotesLoading] = useState(false);

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

  useEffect(() => {
    info("Analysis results ready");
  }, []);

  const handleSaveNotes = async (notes: string) => {
    try {
      setNotesLoading(true);
      const scanIdStr = Array.isArray(scanId) ? scanId[0] : (scanId as string);
      await scansAPI.updatePatientNotes(scanIdStr, notes);
      setPatientNotes(notes);
      setNotesLoading(false);
    } catch (error) {
      setNotesLoading(false);
      throw error;
    }
  };

  const isPneumonia = result === "PNEUMONIA";
  const predictionText = isPneumonia ? "Pneumonia Detected" : "Normal";
  const confidenceNum = parseFloat(confidence as string);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top + 8 : 16 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/(tabs)")}
        >
          <Ionicons name="close" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analysis Results</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.imageCard}>
          <Image
            source={{ uri: imageUri as string }}
            style={styles.xrayImage}
          />
        </View>

        <View
          style={[
            styles.predictionCard,
            isPneumonia ? styles.predictionDanger : styles.predictionSafe,
          ]}
        >
          <View style={styles.predictionIcon}>
            <Ionicons
              name={isPneumonia ? "warning" : "checkmark-circle"}
              size={48}
              color={isPneumonia ? COLORS.danger : COLORS.success}
            />
          </View>
          <Text
            style={[
              styles.predictionText,
              isPneumonia ? styles.textDanger : styles.textSafe,
            ]}
          >
            {predictionText}
          </Text>
          <Text style={styles.predictionSubtext}>
            Based on AI analysis of chest X-ray
          </Text>
        </View>

        <View style={styles.confidenceCard}>
          <Text style={styles.confidenceLabel}>Confidence Score</Text>
          <Text style={styles.confidenceValue}>
            {confidenceNum.toFixed(1)}%
          </Text>
          <View style={styles.confidenceBar}>
            <View
              style={[
                styles.confidenceBarFill,
                {
                  width: `${confidenceNum}%`,
                  backgroundColor: isPneumonia ? COLORS.danger : COLORS.success,
                },
              ]}
            />
          </View>
          <Text style={styles.confidenceDescription}>
            {confidenceNum > 90
              ? "Very High Confidence"
              : confidenceNum > 75
                ? "High Confidence"
                : "Moderate Confidence"}
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Patient Information</Text>
          <InfoRow label="Patient ID" value={patientId as string} />
          <InfoRow label="Name" value={patientName as string} />
          <InfoRow label="Age" value={`${age} years`} />
          <InfoRow label="Sex" value={sex as string} />
          <InfoRow label="Scan Date" value={scanDate as string} />
        </View>

        {/* Patient Notes Section */}
        <View style={styles.notesCard}>
          <View style={styles.notesHeader}>
            <Text style={styles.cardTitle}>Clinical Notes</Text>
            <TouchableOpacity
              style={styles.editNotesButton}
              onPress={() => setNotesModalVisible(true)}
            >
              <Ionicons name="pencil" size={16} color={COLORS.primary} />
              <Text style={styles.editNotesText}>Edit</Text>
            </TouchableOpacity>
          </View>

          {patientNotes ? (
            <Text style={styles.notesText}>{patientNotes}</Text>
          ) : (
            <Text style={styles.notesPlaceholder}>
              No clinical notes added yet
            </Text>
          )}
        </View>

        <View style={styles.disclaimerBox}>
          <View style={styles.disclaimerHeader}>
            <Ionicons name="information-circle" size={20} color={COLORS.warning} />
            <Text style={styles.disclaimerTitle}>Medical Disclaimer</Text>
          </View>
          <Text style={styles.disclaimerText}>
            This AI-generated result is for screening purposes only and must be
            reviewed by a qualified healthcare professional before any clinical
            decision is made.
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() =>
              router.push({
                pathname: "/analysis/results/explainable",
                params: { scanId, imageUri, result, confidence, heatmapUrl },
              })
            }
          >
            <Ionicons name="color-palette-outline" size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>View Heatmap</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() =>
              router.push({
                pathname: "/report/[scanId]",
                params: { scanId: Array.isArray(scanId) ? scanId[0] : scanId },
              })
            }
          >
            <Ionicons name="document-text-outline" size={20} color={COLORS.primary} />
            <Text style={styles.secondaryButtonText}>Generate Report</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tertiaryButton}
            onPress={() => router.replace("/(tabs)")}
          >
            <Text style={styles.tertiaryButtonText}>Return to Dashboard</Text>
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
    paddingBottom: 20,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...SHADOWS.light,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  imageCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  xrayImage: {
    width: "100%",
    height: 300,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.primaryLight,
  },
  predictionCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: 24,
    marginBottom: 16,
    alignItems: "center",
    borderWidth: 2,
  },
  predictionDanger: {
    backgroundColor: COLORS.dangerLight,
    borderColor: COLORS.danger,
  },
  predictionSafe: {
    backgroundColor: COLORS.successLight,
    borderColor: COLORS.success,
  },
  predictionIcon: {
    marginBottom: 16,
  },
  predictionText: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  textDanger: {
    color: COLORS.danger,
  },
  textSafe: {
    color: COLORS.success,
  },
  predictionSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  confidenceCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: 24,
    marginBottom: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  confidenceLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 8,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  confidenceValue: {
    fontSize: 48,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  confidenceBar: {
    width: "100%",
    height: 10,
    backgroundColor: COLORS.border,
    borderRadius: BORDER_RADIUS.round,
    overflow: "hidden",
    marginBottom: 12,
  },
  confidenceBarFill: {
    height: "100%",
    borderRadius: BORDER_RADIUS.round,
  },
  confidenceDescription: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  infoCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  notesCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  notesHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  editNotesButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.primaryLight,
    borderRadius: BORDER_RADIUS.sm,
    gap: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  editNotesText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "700",
  },
  notesText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 20,
    fontWeight: "500",
  },
  notesPlaceholder: {
    fontSize: 14,
    color: COLORS.textTertiary,
    fontStyle: "italic",
  },
  disclaimerBox: {
    backgroundColor: COLORS.warningLight,
    borderWidth: 1,
    borderColor: COLORS.warning,
    borderRadius: BORDER_RADIUS.lg,
    padding: 16,
    marginBottom: 16,
  },
  disclaimerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  disclaimerTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.warning,
    letterSpacing: -0.3,
  },
  disclaimerText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
    fontWeight: "500",
  },
  actionButtons: {
    gap: 12,
  },
  primaryButton: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    ...SHADOWS.light,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  secondaryButton: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  tertiaryButton: {
    backgroundColor: "transparent",
    borderRadius: BORDER_RADIUS.md,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  tertiaryButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  bottomSpacer: {
    height: 40,
  },
});
