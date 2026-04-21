import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
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
import { Card } from "../../components/premium";
import { useToast } from "../../hooks/useToast";
import { scansAPI } from "../../services/api.client";
import type { Scan } from "../../types/api";
import { getErrorMessage } from "../../utils/errorHandler";

export default function PatientScanDetailsScreen() {
  const { scanId } = useLocalSearchParams();
  const { error: showError } = useToast();
  const [scan, setScan] = useState<Scan | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0B5ED7" />
      </View>
    );
  }

  if (!scan) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#0B5ED7" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan Details</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#EF4444" />
          <Text style={styles.errorText}>Scan not found</Text>
        </View>
      </View>
    );
  }

  const isNormal = scan.result === "NORMAL";
  const resultColor = isNormal ? "#10B981" : "#EF4444";
  const resultBgColor = isNormal ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.08)";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#0B5ED7" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Results</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {scan.imageUrl && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: scan.imageUrl }}
              style={styles.scanImage}
              resizeMode="cover"
            />
          </View>
        )}

        <View style={styles.section}>
          <Card elevated="medium" backgroundColor={resultBgColor}>
            <View style={styles.resultHeader}>
              <Ionicons
                name={isNormal ? "checkmark-circle" : "alert-circle"}
                size={32}
                color={resultColor}
              />
              <Text style={[styles.resultTitle, { color: resultColor }]}>
                {isNormal ? "Normal Scan" : "Concerns Detected"}
              </Text>
            </View>

            <View style={styles.resultDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Diagnosis:</Text>
                <Text style={[styles.detailValue, { color: resultColor }]}>
                  {scan.result}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Confidence Score:</Text>
                <Text style={styles.detailValue}>
                  {scan.confidence ? Math.round(scan.confidence * 100) : "N/A"}%
                </Text>
              </View>

              {scan.confidence && (
                <View style={styles.confidenceBar}>
                  <View
                    style={[
                      styles.confidenceFill,
                      {
                        width: `${Math.round(scan.confidence * 100)}%`,
                        backgroundColor: resultColor,
                      },
                    ]}
                  />
                </View>
              )}
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Scan Information</Text>
          <Card elevated="light">
            <View style={styles.metadataRow}>
              <View style={[styles.metadataIcon, { backgroundColor: "rgba(11, 94, 215, 0.1)" }]}>
                <Ionicons name="calendar-outline" size={20} color="#0B5ED7" />
              </View>
              <View style={styles.metadataContent}>
                <Text style={styles.metadataLabel}>Uploaded</Text>
                <Text style={styles.metadataValue}>
                  {new Date(scan.createdAt).toLocaleString()}
                </Text>
              </View>
            </View>

            <View style={styles.metadataRow}>
              <View style={[styles.metadataIcon, { backgroundColor: "rgba(11, 94, 215, 0.1)" }]}>
                <Ionicons name="time-outline" size={20} color="#0B5ED7" />
              </View>
              <View style={styles.metadataContent}>
                <Text style={styles.metadataLabel}>Updated</Text>
                <Text style={styles.metadataValue}>
                  {new Date(scan.updatedAt).toLocaleString()}
                </Text>
              </View>
            </View>

            <View style={styles.metadataRow}>
              <View style={[styles.metadataIcon, { backgroundColor: "rgba(11, 94, 215, 0.1)" }]}>
                <Ionicons name="person-outline" size={20} color="#0B5ED7" />
              </View>
              <View style={styles.metadataContent}>
                <Text style={styles.metadataLabel}>Analyzed By</Text>
                <Text style={styles.metadataValue}>
                  {scan.doctor?.name || "AI Model"}
                </Text>
              </View>
            </View>

            <View style={[styles.metadataRow, { borderBottomWidth: 0 }]}>
              <View style={[styles.metadataIcon, { backgroundColor: "rgba(11, 94, 215, 0.1)" }]}>
                <Ionicons name="pulse-outline" size={20} color="#0B5ED7" />
              </View>
              <View style={styles.metadataContent}>
                <Text style={styles.metadataLabel}>Status</Text>
                <Text style={styles.metadataValue}>
                  {scan.status === "COMPLETED" ? "✓ Completed" : scan.status}
                </Text>
              </View>
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Next Steps</Text>
          <Card elevated="light" backgroundColor="rgba(245, 158, 11, 0.08)">
            <View style={styles.recommendationHeader}>
              <Ionicons name="bulb-outline" size={24} color="#D97706" />
              <Text style={styles.recommendationTitle}>Recommendations</Text>
            </View>

            {isNormal ? (
              <View style={styles.recommendationItem}>
                <Text style={styles.recommendationText}>
                  ✓ Your scan shows normal findings. Continue regular check-ups
                  as recommended by your healthcare provider.
                </Text>
              </View>
            ) : (
              <View>
                <View style={styles.recommendationItem}>
                  <Text style={styles.recommendationText}>
                    • Consult with your healthcare provider to discuss these
                    findings.
                  </Text>
                </View>
                <View style={styles.recommendationItem}>
                  <Text style={styles.recommendationText}>
                    • Consider follow-up imaging if recommended by your doctor.
                  </Text>
                </View>
                <View style={styles.recommendationItem}>
                  <Text style={styles.recommendationText}>
                    • Seek medical attention promptly for clinical correlation.
                  </Text>
                </View>
              </View>
            )}
          </Card>
        </View>

        <View style={styles.section}>
          <Card elevated="light" backgroundColor="rgba(11, 94, 215, 0.08)">
            <View style={styles.disclaimerContainer}>
              <Ionicons name="information-circle" size={24} color="#0B5ED7" />
              <View style={styles.disclaimerContent}>
                <Text style={styles.disclaimerTitle}>Medical Disclaimer</Text>
                <Text style={styles.disclaimerText}>
                  This AI analysis is an assistive tool only and should not be
                  considered a medical diagnosis. Always consult with a qualified
                  healthcare professional for medical advice and diagnosis.
                </Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFBFC",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFBFC",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#EF4444",
    marginTop: 12,
    fontWeight: "600",
  },
  imageContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  scanImage: {
    width: "100%",
    height: 300,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  resultDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  confidenceBar: {
    height: 8,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 4,
    overflow: "hidden",
    marginTop: 4,
  },
  confidenceFill: {
    height: "100%",
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  metadataRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  metadataIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  metadataContent: {
    flex: 1,
  },
  metadataLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 2,
    fontWeight: "500",
  },
  metadataValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  recommendationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#B45309",
  },
  recommendationItem: {
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: "#92400E",
    lineHeight: 20,
    fontWeight: "500",
  },
  disclaimerContainer: {
    flexDirection: "row",
    gap: 12,
  },
  disclaimerContent: {
    flex: 1,
  },
  disclaimerTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0B5ED7",
    marginBottom: 4,
  },
  disclaimerText: {
    fontSize: 13,
    color: "#1E3A8A",
    lineHeight: 18,
    fontWeight: "500",
  },
});
