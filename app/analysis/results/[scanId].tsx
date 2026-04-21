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
import { Card } from "../../../components/premium";
import { InfoRow } from "../../../components/InfoRow";
import { PatientNotesModal } from "../../../components/PatientNotesModal";
import { useToast } from "../../../hooks/useToast";
import { scansAPI } from "../../../services/api.client";

export default function ResultsScreen() {
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
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/(tabs)")}
        >
          <Ionicons name="close" size={24} color="#0B5ED7" />
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
              color={isPneumonia ? "#D32F2F" : "#4CAF50"}
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
                  backgroundColor: isPneumonia ? "#D32F2F" : "#4CAF50",
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
              <Ionicons name="pencil" size={16} color="#0B5ED7" />
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
            <Ionicons name="information-circle" size={20} color="#856404" />
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
                params: { scanId, imageUri, result, confidence },
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
            <Ionicons name="document-text-outline" size={20} color="#0B5ED7" />
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
    backgroundColor: "#FAFBFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
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
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  xrayImage: {
    width: "100%",
    height: 300,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  predictionCard: {
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    alignItems: "center",
    borderWidth: 2,
  },
  predictionDanger: {
    backgroundColor: "rgba(239, 68, 68, 0.08)",
    borderColor: "#EF4444",
  },
  predictionSafe: {
    backgroundColor: "rgba(16, 185, 129, 0.08)",
    borderColor: "#10B981",
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
    color: "#EF4444",
  },
  textSafe: {
    color: "#10B981",
  },
  predictionSubtext: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  confidenceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  confidenceLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 8,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  confidenceValue: {
    fontSize: 48,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  confidenceBar: {
    width: "100%",
    height: 10,
    backgroundColor: "#E5E7EB",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 12,
  },
  confidenceBarFill: {
    height: "100%",
    borderRadius: 5,
  },
  confidenceDescription: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6B7280",
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  notesCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
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
    backgroundColor: "#EFF6FF",
    borderRadius: 6,
    gap: 4,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  editNotesText: {
    color: "#0B5ED7",
    fontSize: 13,
    fontWeight: "700",
  },
  notesText: {
    fontSize: 14,
    color: "#111827",
    lineHeight: 20,
    fontWeight: "500",
  },
  notesPlaceholder: {
    fontSize: 14,
    color: "#9CA3AF",
    fontStyle: "italic",
  },
  disclaimerBox: {
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FCD34D",
    borderRadius: 12,
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
    color: "#92400E",
    letterSpacing: -0.3,
  },
  disclaimerText: {
    fontSize: 13,
    color: "#92400E",
    lineHeight: 20,
    fontWeight: "500",
  },
  actionButtons: {
    gap: 12,
  },
  primaryButton: {
    flexDirection: "row",
    backgroundColor: "#0B5ED7",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  secondaryButton: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 2,
    borderColor: "#0B5ED7",
  },
  secondaryButtonText: {
    color: "#0B5ED7",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  tertiaryButton: {
    backgroundColor: "transparent",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  tertiaryButtonText: {
    color: "#0B5ED7",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  bottomSpacer: {
    height: 40,
  },
});
