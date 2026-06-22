import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState, useContext } from "react";
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
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Card } from "../../components/premium";
import { AuthContext } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { scansAPI } from "../../services/api.client";
import type { Scan } from "../../types/api";
import { getErrorMessage } from "../../utils/errorHandler";
import { generateHTMLReport } from "../../utils/reportGenerator";
import { COLORS, BORDER_RADIUS, SHADOWS, SPACING } from "../../constants/Theme";

export default function PatientScanDetailsScreen() {
  const insets = useSafeAreaInsets();
  const { scanId } = useLocalSearchParams();
  const { error: showError, success: showSuccess } = useToast();
  const [scan, setScan] = useState<Scan | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  useEffect(() => {
    loadScanDetails();
  }, [scanId]);

  const loadScanDetails = async () => {
    try {
      setLoading(true);
      if (typeof scanId === "string") {
        const response = await scansAPI.getScanPatientView(scanId);
        setScan(response.scan || response);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePDF = async () => {
    if (!scan) return;
    try {
      setGenerating(true);
      
      const scanData = {
        id: scan.id,
        patientId: user?.id || "N/A",
        patientName: user?.name || "Unknown Patient",
        age: user?.dateOfBirth ? new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear() : 30,
        sex: user?.gender === "MALE" ? "Male" : (user?.gender === "FEMALE" ? "Female" : "N/A"),
        scanDate: new Date(scan.createdAt).toLocaleDateString(),
        prediction: scan.result === "PNEUMONIA" ? "Pneumonia Suspected" : "Normal",
        confidence: scan.confidence || 0,
        imageUri: scan.imageUrl || "https://via.placeholder.com/400x400/1E293B/FFFFFF?text=Chest+X-Ray",
        heatmapUri: scan.heatmapUrl || "https://via.placeholder.com/400x400/1E293B/FFFFFF?text=AI+Heatmap",
        technician: scan.doctorName || "Attending Clinician",
        notes: scan.clinicianNotes || "No notes provided.",
      };

      const html = generateHTMLReport(scanData);
      const { uri } = await Print.printToFileAsync({ html, base64: false });
      
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        showError("PDF sharing is not available on this device");
        return;
      }

      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: "Share Health Report",
        UTI: "com.adobe.pdf",
      });
      showSuccess("Report compiled successfully!");
    } catch (error) {
      showError("Failed to compile health report PDF");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!scan) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top + 8 : 16 }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.replace("/(patient)")}>
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan Details</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={COLORS.danger} />
          <Text style={styles.errorText}>Scan details not found</Text>
        </View>
      </View>
    );
  }

  const isNormal = scan.result === "NORMAL";
  const statusLabelText = isNormal ? "Normal Scan" : "Review Recommended";
  const statusColor = isNormal ? COLORS.success : COLORS.danger;
  const statusBgColor = isNormal ? COLORS.successLight : COLORS.dangerLight;

  return (
    <View style={styles.container}>
      {/* Header bar */}
      <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top + 8 : 16 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.replace("/(patient)")}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Results</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 1. Chest X-Ray Preview (40% Screen visual space) */}
        <View style={styles.xraySection}>
          <Card elevated="medium" padded={false} style={styles.xrayCard}>
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: showOverlay && scan.heatmapUrl ? scan.heatmapUrl : scan.imageUrl }}
                style={styles.scanImage}
                resizeMode="cover"
              />
              {scan.heatmapUrl && (
                <TouchableOpacity
                  style={styles.overlayToggle}
                  onPress={() => setShowOverlay(!showOverlay)}
                >
                  <Ionicons name="eye-outline" size={16} color="#FFFFFF" />
                  <Text style={styles.overlayToggleText}>
                    {showOverlay ? "Hide Overlay" : "Show Overlay"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </Card>
        </View>

        {/* 2. Result Summary (20% Screen space) */}
        <View style={styles.summarySection}>
          <Card elevated="light" style={StyleSheet.flatten([styles.summaryCard, { borderColor: statusColor }])}>
            <View style={styles.resultHeader}>
              <Ionicons
                name={isNormal ? "checkmark-circle" : "alert-circle"}
                size={28}
                color={statusColor}
              />
              <Text style={[styles.resultTitle, { color: statusColor }]}>
                {statusLabelText}
              </Text>
            </View>
            <Text style={styles.scanMetaLabel}>
              Scan Date: {new Date(scan.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
            {scan.doctorName && (
              <Text style={styles.attendingText}>Attending clinician: {scan.doctorName}</Text>
            )}
          </Card>
        </View>

        {/* 3. What this means (20% Screen space) */}
        <View style={styles.explanationSection}>
          <Text style={styles.sectionTitle}>What this means</Text>
          <Card border={true} elevated="none" style={styles.card}>
            <Text style={styles.explanationText}>
              {isNormal
                ? "No significant clinical concerns were identified by the AI system on your chest X-ray. Your lung fields appear clear."
                : "The screening system detected patterns that warrant review by a medical professional. This is a screening indicator and does not represent a final medical diagnosis."}
            </Text>
          </Card>
        </View>

        {/* 4. Recommended next steps (20% Screen space) */}
        <View style={styles.stepsSection}>
          <Text style={styles.sectionTitle}>Recommended Next Steps</Text>
          <Card border={false} elevated="none" backgroundColor={COLORS.primaryLight} style={styles.stepsCard}>
            {isNormal ? (
              <View style={styles.stepsList}>
                <View style={styles.stepRow}>
                  <Ionicons name="checkmark-circle-outline" size={18} color={COLORS.primary} />
                  <Text style={styles.stepText}>Continue regular checkups with your doctor.</Text>
                </View>
                <View style={styles.stepRow}>
                  <Ionicons name="checkmark-circle-outline" size={18} color={COLORS.primary} />
                  <Text style={styles.stepText}>Download a copy of the clinical report for your records.</Text>
                </View>
              </View>
            ) : (
              <View style={styles.stepsList}>
                <View style={styles.stepRow}>
                  <Ionicons name="alert-circle-outline" size={18} color={COLORS.danger} />
                  <Text style={styles.stepText}>Schedule a follow-up appointment with a qualified doctor.</Text>
                </View>
                <View style={styles.stepRow}>
                  <Ionicons name="alert-circle-outline" size={18} color={COLORS.danger} />
                  <Text style={styles.stepText}>Download your health report to share with your physician.</Text>
                </View>
                <View style={styles.stepRow}>
                  <Ionicons name="alert-circle-outline" size={18} color={COLORS.danger} />
                  <Text style={styles.stepText}>Seek prompt attention if you experience severe symptoms like high fever or trouble breathing.</Text>
                </View>
              </View>
            )}
          </Card>
        </View>

        {/* Safety Note Disclaimer */}
        <View style={styles.safetyBox}>
          <Ionicons name="information-circle" size={20} color={COLORS.secondary} />
          <Text style={styles.safetyText}>
            Safety Note: This AI result is for screening support and should be reviewed by a qualified healthcare professional.
          </Text>
        </View>

        {/* 5. Download / Share / Upload new buttons */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.primaryActionButton}
            onPress={handleGeneratePDF}
            disabled={generating}
          >
            {generating ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Ionicons name="share-outline" size={20} color="#FFFFFF" />
                <Text style={styles.primaryActionButtonText}>Download & Share Report</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryActionButton}
            onPress={() => router.push("/(patient)/upload")}
          >
            <Ionicons name="cloud-upload-outline" size={20} color={COLORS.primary} />
            <Text style={styles.secondaryActionButtonText}>Upload New Scan</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.card,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...SHADOWS.light,
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
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  xraySection: {
    marginTop: 16,
  },
  xrayCard: {
    borderRadius: BORDER_RADIUS.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  imageWrapper: {
    position: "relative",
    width: "100%",
    height: 260,
    backgroundColor: "#0F172A",
  },
  scanImage: {
    width: "100%",
    height: "100%",
  },
  overlayToggle: {
    position: "absolute",
    bottom: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  overlayToggleText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  summarySection: {
    marginTop: 16,
  },
  summaryCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5,
    padding: 16,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  scanMetaLabel: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  attendingText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "500",
    marginTop: 4,
  },
  explanationSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 10,
    marginLeft: 4,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  explanationText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    fontWeight: "500",
  },
  stepsSection: {
    marginTop: 20,
  },
  stepsCard: {
    borderRadius: BORDER_RADIUS.md,
    padding: 16,
  },
  stepsList: {
    gap: 12,
  },
  stepRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
  stepText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: "600",
    lineHeight: 18,
  },
  safetyBox: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: COLORS.secondaryLight,
    borderRadius: BORDER_RADIUS.md,
    padding: 14,
    marginTop: 20,
    alignItems: "flex-start",
  },
  safetyText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.secondary,
    lineHeight: 16,
    fontWeight: "600",
  },
  actionsSection: {
    gap: 12,
    marginTop: 24,
  },
  primaryActionButton: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    ...SHADOWS.light,
  },
  primaryActionButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  secondaryActionButton: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  secondaryActionButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "800",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: COLORS.danger,
    marginTop: 12,
    fontWeight: "600",
  },
});
