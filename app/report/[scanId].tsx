import { Ionicons } from "@expo/vector-icons";
import * as Print from "expo-print";
import { router, useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { dialogManager } from "../../utils/dialogManager";
import { useToast } from "../../hooks/useToast";
import { generateHTMLReport } from "../../utils/reportGenerator";
import { scansAPI } from "../../services/api.client";
import { Scan } from "../../types/api";
import { COLORS, BORDER_RADIUS, SHADOWS, SPACING } from "../../constants/Theme";
import { PneumoLoader, Card } from "../../components/premium";

export default function ReportScreen() {
  const insets = useSafeAreaInsets();
  const { scanId } = useLocalSearchParams();
  const [scan, setScan] = useState<Scan | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const { error: showError, success } = useToast();

  const scanIdStr = Array.isArray(scanId) ? scanId[0] : (scanId as string);

  useEffect(() => {
    loadScanData();
  }, [scanId]);

  const loadScanData = async () => {
    if (!scanIdStr) return;
    try {
      setLoading(true);
      const data = await scansAPI.getById(scanIdStr);
      setScan(data);
    } catch (error) {
      showError("Failed to load scan report details");
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceLabel = (conf: number) => {
    if (conf >= 90) return "High Confidence";
    if (conf >= 70) return "Moderate Confidence";
    return "Low Confidence";
  };

  // Map scan attributes dynamically
  const scanData = {
    id: scan?.id || "N/A",
    patientId: scan?.patient?.idNumber || "N/A",
    patientName: scan?.patient?.name || "Unknown Patient",
    age: scan?.patient?.age || 0,
    sex: scan?.patient?.gender === "MALE" ? "Male" : (scan?.patient?.gender === "FEMALE" ? "Female" : "N/A"),
    scanDate: scan?.createdAt ? new Date(scan.createdAt).toLocaleDateString() : "N/A",
    prediction: scan?.result === "PNEUMONIA" ? "Pneumonia Suspected" : "Normal",
    confidence: scan?.confidence || 0,
    imageUri: scan?.imageUrl || "https://via.placeholder.com/400x400/1E293B/FFFFFF?text=Chest+X-Ray",
    heatmapUri: scan?.heatmapUrl || "https://via.placeholder.com/400x400/1E293B/FFFFFF?text=AI+Heatmap",
    technician: scan?.clinician?.name || "Attending Clinician",
    notes: scan?.clinicianNotes || "Recommend clinical correlation and physician observation.",
  };

  const handleGeneratePDF = async () => {
    try {
      setGenerating(true);
      const html = generateHTMLReport(scanData);

      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });

      setPdfUri(uri);
      setGenerating(false);

      dialogManager.show({
        title: "Report Generated",
        message: "The PDF clinical report has been compiled successfully.",
        buttons: [
          { text: "OK" },
          {
            text: "Share",
            onPress: () => handleSharePDF(uri),
          },
        ],
      });
    } catch (error) {
      setGenerating(false);
      showError("Failed to generate report PDF");
    }
  };

  const handleSharePDF = async (uri: string) => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        showError("Sharing is not available on this device");
        return;
      }

      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: "Share Medical Report",
        UTI: "com.adobe.pdf",
      });
    } catch (error) {
      showError("Failed to share PDF");
    }
  };

  const handlePrintReport = async () => {
    try {
      const html = generateHTMLReport(scanData);
      await Print.printAsync({ html });
    } catch (error) {
      showError("Failed to print report");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <PneumoLoader size={48} color={COLORS.primary} />
        <Text style={styles.loadingText}>Fetching scan data...</Text>
      </View>
    );
  }

  if (!scan) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Scan record not found.</Text>
      </View>
    );
  }

  const isPneumonia = scan.result === "PNEUMONIA";

  return (
    <View style={styles.container}>
      {/* Header Back bar */}
      <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top + 8 : 16 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Clinical Report</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.idBadge}>
          <Text style={styles.idText}>Scan ID: {scanData.id.substring(0, 16)}</Text>
        </View>

        <Card elevated="light" style={styles.card}>
          <Text style={styles.cardTitle}>Patient EMR Information</Text>
          <View style={styles.infoGrid}>
            <InfoRow label="Patient ID" value={scanData.patientId} />
            <InfoRow label="Name" value={scanData.patientName} />
            <InfoRow label="Age / Sex" value={`${scanData.age} years / ${scanData.sex}`} />
            <InfoRow label="Scan Date" value={scanData.scanDate} />
            <InfoRow label="Attending" value={scanData.technician} />
          </View>
        </Card>

        <View
          style={[
            styles.predictionCard,
            isPneumonia ? styles.predictionDanger : styles.predictionSafe,
          ]}
        >
          <Text style={styles.predictionLabel}>Screening Diagnosis</Text>
          <Text
            style={[
              styles.predictionText,
              isPneumonia ? styles.textDanger : styles.textSafe,
            ]}
          >
            {scanData.prediction}
          </Text>
          <View style={styles.confidenceContainer}>
            <Text style={styles.confidenceValue}>
              {scanData.confidence.toFixed(0)}%
            </Text>
            <Text style={styles.confidenceLabel}>
              Confidence Score • {getConfidenceLabel(scanData.confidence)}
            </Text>
          </View>
        </View>

        <Card elevated="light" style={styles.card}>
          <Text style={styles.cardTitle}>Radiographic Views</Text>
          <View style={styles.imageGrid}>
            <View style={styles.imageContainer}>
              <Text style={styles.imageTitle}>Original X-Ray</Text>
              <Image
                source={{ uri: scanData.imageUri }}
                style={styles.medicalImage}
              />
            </View>
            {scan.heatmapUrl ? (
              <View style={styles.imageContainer}>
                <Text style={styles.imageTitle}>AI Heatmap</Text>
                <Image
                  source={{ uri: scanData.heatmapUri }}
                  style={styles.medicalImage}
                />
              </View>
            ) : null}
          </View>
        </Card>

        <Card elevated="light" style={styles.card}>
          <Text style={styles.cardTitle}>Clinical Notes</Text>
          <Text style={styles.notesText}>{scanData.notes}</Text>
        </Card>

        <View style={styles.disclaimerBox}>
          <View style={styles.disclaimerHeader}>
            <Ionicons name="information-circle" size={20} color={COLORS.warning} />
            <Text style={styles.disclaimerTitle}>Medical Disclaimer</Text>
          </View>
          <Text style={styles.disclaimerText}>
            This report is generated by an AI diagnostic screening assistance system and must be
            reviewed by a qualified clinician. It is not intended for standalone diagnostic confirmation.
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleGeneratePDF}
            disabled={generating}
          >
            {generating ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="download-outline" size={20} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>Generate PDF Document</Text>
              </>
            )}
          </TouchableOpacity>

          {pdfUri && (
            <>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => handleSharePDF(pdfUri)}
              >
                <Ionicons name="share-outline" size={20} color={COLORS.primary} />
                <Text style={styles.secondaryButtonText}>Share PDF Report</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handlePrintReport}
              >
                <Ionicons name="print-outline" size={20} color={COLORS.primary} />
                <Text style={styles.secondaryButtonText}>Print PDF Document</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  idBadge: {
    backgroundColor: COLORS.primary,
    alignSelf: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
    ...SHADOWS.light,
  },
  idText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  card: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 14,
    letterSpacing: -0.2,
  },
  infoGrid: {
    gap: 2,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "700",
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: "800",
  },
  predictionCard: {
    borderRadius: BORDER_RADIUS.md,
    padding: 20,
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
  predictionLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 6,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  predictionText: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 14,
  },
  textDanger: {
    color: COLORS.danger,
  },
  textSafe: {
    color: COLORS.success,
  },
  confidenceContainer: {
    alignItems: "center",
  },
  confidenceValue: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  confidenceLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontWeight: "700",
  },
  imageGrid: {
    gap: 16,
  },
  imageContainer: {
    alignItems: "center",
  },
  imageTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  medicalImage: {
    width: "100%",
    height: 220,
    borderRadius: 8,
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  notesText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    lineHeight: 20,
    fontWeight: "600",
  },
  disclaimerBox: {
    backgroundColor: COLORS.warningLight,
    borderWidth: 1,
    borderColor: COLORS.warning,
    borderRadius: BORDER_RADIUS.md,
    padding: 16,
    marginBottom: 20,
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
  },
  disclaimerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
    fontWeight: "600",
  },
  actionButtons: {
    gap: 10,
    marginBottom: 32,
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
    fontSize: 14,
    fontWeight: "800",
  },
  secondaryButton: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.sm,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "800",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  bottomSpacer: {
    height: 40,
  },
});
