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
import { useToast } from "../../hooks/useToast";
import { scansAPI } from "../../services/api.client";
import type { Scan } from "../../types/api";
import { getErrorMessage } from "../../utils/errorHandler";

export default function PatientScanDetailsScreen() {
  const { scanId } = useLocalSearchParams();
  const { error: showError, success } = useToast();
  const [scan, setScan] = useState<Scan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScanDetails();
  }, [scanId]);

  const loadScanDetails = async () => {
    try {
      setLoading(true);
      if (typeof scanId === "string") {
        // Use patient-specific endpoint for patient-safe fields
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
        <ActivityIndicator size="large" color="#0066CC" />
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
            <Ionicons name="arrow-back" size={24} color="#0066CC" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan Details</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#D32F2F" />
          <Text style={styles.errorText}>Scan not found</Text>
        </View>
      </View>
    );
  }

  const resultColor = scan.result === "NORMAL" ? "#4CAF50" : "#FF9800";
  const resultBgColor = scan.result === "NORMAL" ? "#E8F5E9" : "#FFF3E0";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#0066CC" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Results</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Scan Image */}
        {scan.imageUrl && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: scan.imageUrl }}
              style={styles.scanImage}
              resizeMode="cover"
            />
          </View>
        )}

        {/* Result Card */}
        <View style={[styles.resultCard, { backgroundColor: resultBgColor }]}>
          <View style={styles.resultHeader}>
            <Ionicons
              name={
                scan.result === "NORMAL" ? "checkmark-circle" : "alert-circle"
              }
              size={32}
              color={resultColor}
            />
            <Text style={[styles.resultTitle, { color: resultColor }]}>
              {scan.result === "NORMAL" ? "Normal Scan" : "Concerns Detected"}
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
        </View>

        {/* Metadata */}
        <View style={styles.metadataCard}>
          <Text style={styles.sectionTitle}>Scan Information</Text>

          <View style={styles.metadataRow}>
            <View style={styles.metadataIcon}>
              <Ionicons name="calendar-outline" size={20} color="#0066CC" />
            </View>
            <View style={styles.metadataContent}>
              <Text style={styles.metadataLabel}>Uploaded</Text>
              <Text style={styles.metadataValue}>
                {new Date(scan.createdAt).toLocaleString()}
              </Text>
            </View>
          </View>

          <View style={styles.metadataRow}>
            <View style={styles.metadataIcon}>
              <Ionicons name="time-outline" size={20} color="#0066CC" />
            </View>
            <View style={styles.metadataContent}>
              <Text style={styles.metadataLabel}>Updated</Text>
              <Text style={styles.metadataValue}>
                {new Date(scan.updatedAt).toLocaleString()}
              </Text>
            </View>
          </View>

          <View style={styles.metadataRow}>
            <View style={styles.metadataIcon}>
              <Ionicons name="person-outline" size={20} color="#0066CC" />
            </View>
            <View style={styles.metadataContent}>
              <Text style={styles.metadataLabel}>Analyzed By</Text>
              <Text style={styles.metadataValue}>
                {scan.doctor?.name || "AI Model"}
              </Text>
            </View>
          </View>

          <View style={styles.metadataRow}>
            <View style={styles.metadataIcon}>
              <Ionicons name="pulse-outline" size={20} color="#0066CC" />
            </View>
            <View style={styles.metadataContent}>
              <Text style={styles.metadataLabel}>Status</Text>
              <Text style={styles.metadataValue}>
                {scan.status === "COMPLETED" ? "✓ Completed" : scan.status}
              </Text>
            </View>
          </View>
        </View>

        {/* Recommendations */}
        <View style={styles.recommendationCard}>
          <View style={styles.recommendationHeader}>
            <Ionicons name="bulb-outline" size={24} color="#FF9800" />
            <Text style={styles.recommendationTitle}>Next Steps</Text>
          </View>

          {scan.result === "NORMAL" ? (
            <View style={styles.recommendationItem}>
              <Text style={styles.recommendationText}>
                ✓ Your scan shows normal findings. Continue regular check-ups as
                recommended by your healthcare provider.
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.recommendationItem}>
                <Text style={styles.recommendationText}>
                  • Consult with your healthcare provider to discuss these
                  findings
                </Text>
              </View>
              <View style={styles.recommendationItem}>
                <Text style={styles.recommendationText}>
                  • Consider follow-up imaging if recommended by your doctor
                </Text>
              </View>
              <View style={styles.recommendationItem}>
                <Text style={styles.recommendationText}>
                  • Seek medical attention promptly for clinical correlation
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimerCard}>
          <Ionicons name="information-circle" size={20} color="#0066CC" />
          <View style={{ flex: 1 }}>
            <Text style={styles.disclaimerTitle}>Medical Disclaimer</Text>
            <Text style={styles.disclaimerText}>
              This AI analysis is an assistive tool only and should not be
              considered a medical diagnosis. Always consult with a qualified
              healthcare professional for medical advice and diagnosis.
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F7",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F7",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F7",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#D32F2F",
    marginTop: 12,
  },
  imageContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scanImage: {
    width: "100%",
    height: 300,
  },
  resultCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: "bold",
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
    color: "#8E8E93",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  confidenceBar: {
    height: 8,
    backgroundColor: "#D0D0D0",
    borderRadius: 4,
    overflow: "hidden",
    marginTop: 4,
  },
  confidenceFill: {
    height: "100%",
    borderRadius: 4,
  },
  notesText: {
    fontSize: 13,
    color: "#555555",
    lineHeight: 18,
    fontStyle: "italic",
  },
  metadataCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginBottom: 12,
  },
  metadataRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F7",
  },
  metadataIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
  },
  metadataContent: {
    flex: 1,
  },
  metadataLabel: {
    fontSize: 12,
    color: "#8E8E93",
    marginBottom: 2,
  },
  metadataValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1C1C1E",
  },
  recommendationCard: {
    backgroundColor: "#FFF3E0",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  recommendationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#E65100",
  },
  recommendationItem: {
    marginBottom: 10,
  },
  recommendationText: {
    fontSize: 13,
    color: "#E65100",
    lineHeight: 18,
  },
  disclaimerCard: {
    backgroundColor: "#E3F2FD",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  disclaimerTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0066CC",
    marginBottom: 4,
  },
  disclaimerText: {
    fontSize: 12,
    color: "#0066CC",
    lineHeight: 16,
  },
});
