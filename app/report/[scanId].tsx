import { Ionicons } from "@expo/vector-icons";
import * as Print from "expo-print";
import { router, useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { dialogManager } from "../../utils/dialogManager";
import { useToast } from "../../hooks/useToast";
import { generateHTMLReport } from "../../utils/reportGenerator";

const mockScanData = {
  id: "SCAN-2024-001",
  patientId: "PT-12345",
  patientName: "John Doe",
  age: 45,
  sex: "Male",
  scanDate: "2024-02-17",
  prediction: "Pneumonia Detected",
  confidence: 94.5,
  imageUri:
    "https://via.placeholder.com/400x400/0066CC/FFFFFF?text=Chest+X-Ray",
  heatmapUri: "https://via.placeholder.com/400x400/FF0000/FFFFFF?text=Heatmap",
  technician: "Dr. Sarah Johnson",
  notes: "Patient shows signs of bacterial pneumonia in lower right lobe.",
};

export default function ReportScreen() {
  const { scanId } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const { error: showError } = useToast();

  const scanData = mockScanData;

  const handleGeneratePDF = async () => {
    try {
      setLoading(true);

      const html = generateHTMLReport(scanData);

      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });

      setPdfUri(uri);
      setLoading(false);

      dialogManager.show({
        title: "PDF Generated",
        message: "Your report has been generated successfully!",
        buttons: [
          { text: "OK" },
          {
            text: "Share",
            onPress: () => handleSharePDF(uri),
          },
        ],
      });
    } catch (error) {
      setLoading(false);
      showError("Failed to generate PDF. Please try again.");
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

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#0066CC" />
      </TouchableOpacity>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.idBadge}>
          <Text style={styles.idText}>{scanData.id}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Patient Information</Text>
          <View style={styles.infoGrid}>
            <InfoRow label="Patient ID" value={scanData.patientId} />
            <InfoRow label="Name" value={scanData.patientName} />
            <InfoRow label="Age" value={`${scanData.age} years`} />
            <InfoRow label="Sex" value={scanData.sex} />
            <InfoRow label="Scan Date" value={scanData.scanDate} />
            <InfoRow label="Technician" value={scanData.technician} />
          </View>
        </View>

        <View
          style={[
            styles.predictionCard,
            scanData.prediction.includes("Pneumonia")
              ? styles.predictionDanger
              : styles.predictionSafe,
          ]}
        >
          <Text style={styles.predictionLabel}>Diagnosis</Text>
          <Text
            style={[
              styles.predictionText,
              scanData.prediction.includes("Pneumonia")
                ? styles.textDanger
                : styles.textSafe,
            ]}
          >
            {scanData.prediction}
          </Text>
          <View style={styles.confidenceContainer}>
            <Text style={styles.confidenceValue}>
              {scanData.confidence.toFixed(1)}%
            </Text>
            <Text style={styles.confidenceLabel}>Confidence Score</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Medical Images</Text>
          <View style={styles.imageGrid}>
            <View style={styles.imageContainer}>
              <Text style={styles.imageTitle}>Original X-Ray</Text>
              <Image
                source={{ uri: scanData.imageUri }}
                style={styles.medicalImage}
              />
            </View>
            <View style={styles.imageContainer}>
              <Text style={styles.imageTitle}>AI Heatmap</Text>
              <Image
                source={{ uri: scanData.heatmapUri }}
                style={styles.medicalImage}
              />
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Clinical Notes</Text>
          <Text style={styles.notesText}>{scanData.notes}</Text>
        </View>

        <View style={styles.disclaimerBox}>
          <View style={styles.disclaimerHeader}>
            <Ionicons name="warning" size={20} color="#856404" />
            <Text style={styles.disclaimerTitle}>Medical Disclaimer</Text>
          </View>
          <Text style={styles.disclaimerText}>
            This report is generated by an AI diagnostic tool and must be
            reviewed by a qualified healthcare professional. Not for standalone
            diagnosis.
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleGeneratePDF}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="download-outline" size={20} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>Generate PDF</Text>
              </>
            )}
          </TouchableOpacity>

          {pdfUri && (
            <>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => handleSharePDF(pdfUri)}
              >
                <Ionicons name="share-outline" size={20} color="#0066CC" />
                <Text style={styles.secondaryButtonText}>Share Report</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handlePrintReport}
              >
                <Ionicons name="print-outline" size={20} color="#0066CC" />
                <Text style={styles.secondaryButtonText}>Print Report</Text>
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
    backgroundColor: "#FAFBFC",
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  content: {
    flex: 1,
    paddingTop: 120,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  idBadge: {
    backgroundColor: "#0B5ED7",
    alignSelf: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
  },
  idText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 18,
    marginBottom: 18,
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
  },
  infoGrid: {
    gap: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  infoLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "700",
  },
  infoValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "700",
  },
  predictionCard: {
    borderRadius: 14,
    padding: 24,
    marginBottom: 18,
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
  predictionLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  predictionText: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 18,
  },
  textDanger: {
    color: "#EF4444",
  },
  textSafe: {
    color: "#10B981",
  },
  confidenceContainer: {
    alignItems: "center",
  },
  confidenceValue: {
    fontSize: 36,
    fontWeight: "800",
    color: "#111827",
  },
  confidenceLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 6,
    fontWeight: "600",
  },
  imageGrid: {
    gap: 16,
  },
  imageContainer: {
    alignItems: "center",
  },
  imageTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: 10,
  },
  medicalImage: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  notesText: {
    fontSize: 14,
    color: "#111827",
    lineHeight: 22,
    fontWeight: "500",
  },
  disclaimerBox: {
    backgroundColor: "rgba(245, 158, 11, 0.08)",
    borderWidth: 2,
    borderColor: "#FCD34D",
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
  },
  disclaimerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  disclaimerTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#D97706",
  },
  disclaimerText: {
    fontSize: 13,
    color: "#92400E",
    lineHeight: 20,
    fontWeight: "500",
  },
  actionButtons: {
    gap: 12,
    marginBottom: 20,
  },
  primaryButton: {
    flexDirection: "row",
    backgroundColor: "#0B5ED7",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#0B5ED7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  secondaryButton: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderWidth: 2,
    borderColor: "#0B5ED7",
  },
  secondaryButtonText: {
    color: "#0B5ED7",
    fontSize: 15,
    fontWeight: "700",
  },
  bottomSpacer: {
    height: 40,
  },
});
