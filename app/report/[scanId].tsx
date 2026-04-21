import { Ionicons } from "@expo/vector-icons";
import * as Print from "expo-print";
import { router, useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

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

  const scanData = mockScanData;

  const generateHTMLReport = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
              color: #1C1C1E;
              padding: 40px;
              background: white;
            }
            
            .header {
              text-align: center;
              margin-bottom: 40px;
              border-bottom: 3px solid #0066CC;
              padding-bottom: 20px;
            }
            
            .logo {
              font-size: 32px;
              font-weight: bold;
              color: #0066CC;
              margin-bottom: 8px;
            }
            
            .subtitle {
              font-size: 14px;
              color: #8E8E93;
            }
            
            .report-title {
              font-size: 24px;
              font-weight: bold;
              margin: 30px 0 20px 0;
              color: #0066CC;
            }
            
            .info-section {
              background: #F5F5F7;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 24px;
            }
            
            .info-row {
              display: flex;
              justify-content: space-between;
              padding: 12px 0;
              border-bottom: 1px solid #E5E5EA;
            }
            
            .info-row:last-child {
              border-bottom: none;
            }
            
            .info-label {
              font-weight: 600;
              color: #636366;
              font-size: 14px;
            }
            
            .info-value {
              font-weight: bold;
              color: #1C1C1E;
              font-size: 14px;
            }
            
            .prediction-box {
              background: ${scanData.prediction.includes("Pneumonia") ? "#FFEBEE" : "#E8F5E9"};
              border: 2px solid ${scanData.prediction.includes("Pneumonia") ? "#D32F2F" : "#4CAF50"};
              padding: 24px;
              border-radius: 12px;
              text-align: center;
              margin: 24px 0;
            }
            
            .prediction-label {
              font-size: 18px;
              font-weight: bold;
              color: ${scanData.prediction.includes("Pneumonia") ? "#D32F2F" : "#4CAF50"};
              margin-bottom: 12px;
            }
            
            .confidence-text {
              font-size: 32px;
              font-weight: bold;
              color: #1C1C1E;
            }
            
            .confidence-label {
              font-size: 14px;
              color: #636366;
              margin-top: 8px;
            }
            
            .images-section {
              margin: 32px 0;
            }
            
            .image-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-top: 16px;
            }
            
            .image-container {
              text-align: center;
            }
            
            .image-title {
              font-size: 14px;
              font-weight: 600;
              color: #636366;
              margin-bottom: 12px;
            }
            
            .xray-image {
              width: 100%;
              height: auto;
              border-radius: 8px;
              border: 2px solid #E5E5EA;
            }
            
            .disclaimer {
              background: #FFF3CD;
              border: 2px solid #FFE69C;
              padding: 20px;
              border-radius: 8px;
              margin: 32px 0;
            }
            
            .disclaimer-title {
              font-weight: bold;
              color: #856404;
              margin-bottom: 12px;
              font-size: 16px;
            }
            
            .disclaimer-text {
              color: #856404;
              font-size: 13px;
              line-height: 1.6;
            }
            
            .notes-section {
              margin: 24px 0;
            }
            
            .notes-title {
              font-size: 16px;
              font-weight: bold;
              color: #1C1C1E;
              margin-bottom: 12px;
            }
            
            .notes-content {
              background: #F9FAFB;
              padding: 16px;
              border-radius: 10px;
              color: #111827;
              line-height: 1.6;
              font-size: 14px;
              border: 1px solid #E5E7EB;
            }
            
            .footer {
              margin-top: 48px;
              text-align: center;
              padding-top: 24px;
              border-top: 2px solid #E5E7EB;
              color: #6B7280;
              font-size: 12px;
            }
            
            .signature-section {
              margin-top: 32px;
              padding-top: 24px;
              border-top: 1px solid #E5E7EB;
            }
            
            .signature-line {
              margin-top: 40px;
              border-top: 2px solid #111827;
              width: 300px;
              padding-top: 8px;
              text-align: center;
            }
            
            @media print {
              body {
                padding: 20px;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">🫁 PneumoScan AI</div>
            <div class="subtitle">AI-Powered Pneumonia Detection System</div>
          </div>

          <h1 class="report-title">Medical Diagnostic Report</h1>

          <div class="info-section">
            <div class="info-row">
              <span class="info-label">Scan ID:</span>
              <span class="info-value">${scanData.id}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Patient ID:</span>
              <span class="info-value">${scanData.patientId}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Patient Name:</span>
              <span class="info-value">${scanData.patientName}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Age:</span>
              <span class="info-value">${scanData.age} years</span>
            </div>
            <div class="info-row">
              <span class="info-label">Sex:</span>
              <span class="info-value">${scanData.sex}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Scan Date:</span>
              <span class="info-value">${scanData.scanDate}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Analyzed By:</span>
              <span class="info-value">${scanData.technician}</span>
            </div>
          </div>

          <div class="prediction-box">
            <div class="prediction-label">${scanData.prediction}</div>
            <div class="confidence-text">${scanData.confidence}%</div>
            <div class="confidence-label">Confidence Score</div>
          </div>

          <div class="images-section">
            <h2 class="report-title">Medical Images</h2>
            <div class="image-grid">
              <div class="image-container">
                <div class="image-title">Original Chest X-Ray</div>
                <img src="${scanData.imageUri}" alt="Chest X-Ray" class="xray-image" />
              </div>
              <div class="image-container">
                <div class="image-title">AI Heatmap Analysis</div>
                <img src="${scanData.heatmapUri}" alt="Heatmap" class="xray-image" />
              </div>
            </div>
          </div>

          <div class="notes-section">
            <div class="notes-title">Clinical Notes</div>
            <div class="notes-content">${scanData.notes}</div>
          </div>

          <div class="disclaimer">
            <div class="disclaimer-title">⚠️ Important Medical Disclaimer</div>
            <div class="disclaimer-text">
              This report is generated by an AI-powered diagnostic assistance tool and should NOT be used as the sole basis for medical diagnosis or treatment decisions. 
              The results must be reviewed and validated by a qualified healthcare professional. 
              This system is intended to assist medical professionals and should not replace clinical judgment. 
              Always consult with a licensed physician for proper medical evaluation and treatment.
            </div>
          </div>

          <div class="signature-section">
            <div class="info-row">
              <span class="info-label">Report Generated:</span>
              <span class="info-value">${new Date().toLocaleString()}</span>
            </div>
            <div class="signature-line">
              <div style="font-size: 12px; color: #636366;">Authorized Medical Professional Signature</div>
            </div>
          </div>

          <div class="footer">
            <p>PneumoScan AI - Advanced Medical Imaging Analysis System</p>
            <p>© 2024 All Rights Reserved | For Medical Professional Use Only</p>
          </div>
        </body>
      </html>
    `;
  };

  const handleGeneratePDF = async () => {
    try {
      setLoading(true);

      const html = generateHTMLReport();

      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });

      setPdfUri(uri);
      setLoading(false);

      Alert.alert(
        "PDF Generated",
        "Your report has been generated successfully!",
        [
          { text: "OK" },
          {
            text: "Share",
            onPress: () => handleSharePDF(uri),
          },
        ],
      );
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Failed to generate PDF. Please try again.");
      console.error(error);
    }
  };

  const handleSharePDF = async (uri: string) => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();

      if (!isAvailable) {
        Alert.alert("Error", "Sharing is not available on this device");
        return;
      }

      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: "Share Medical Report",
        UTI: "com.adobe.pdf",
      });
    } catch (error) {
      Alert.alert("Error", "Failed to share PDF");
      console.error(error);
    }
  };

  const handlePrintReport = async () => {
    try {
      const html = generateHTMLReport();
      await Print.printAsync({ html });
    } catch (error) {
      Alert.alert("Error", "Failed to print report");
      console.error(error);
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
