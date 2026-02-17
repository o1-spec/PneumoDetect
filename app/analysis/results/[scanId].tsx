import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ResultsScreen() {
  const params = useLocalSearchParams();
  const {
    scanId,
    imageUri,
    patientId,
    patientName,
    age,
    sex,
    scanDate,
    prediction,
    confidence,
  } = params;

  const isPneumonia = prediction === "Pneumonia Detected";
  const confidenceNum = parseFloat(confidence as string);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/(tabs)")}
        >
          <Ionicons name="close" size={24} color="#0066CC" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analysis Results</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* X-Ray Preview */}
        <View style={styles.imageCard}>
          <Image source={{ uri: imageUri as string }} style={styles.xrayImage} />
        </View>

        {/* Prediction Card */}
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
            {prediction}
          </Text>
          <Text style={styles.predictionSubtext}>
            Based on AI analysis of chest X-ray
          </Text>
        </View>

        {/* Confidence Score */}
        <View style={styles.confidenceCard}>
          <Text style={styles.confidenceLabel}>Confidence Score</Text>
          <Text style={styles.confidenceValue}>{confidenceNum.toFixed(1)}%</Text>
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

        {/* Patient Info */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Patient Information</Text>
          <InfoRow label="Patient ID" value={patientId as string} />
          <InfoRow label="Name" value={patientName as string} />
          <InfoRow label="Age" value={`${age} years`} />
          <InfoRow label="Sex" value={sex as string} />
          <InfoRow label="Scan Date" value={scanDate as string} />
        </View>

        {/* Disclaimer */}
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

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() =>
              router.push({
                pathname: "/analysis/results/explainable",
                params: { scanId, imageUri, prediction, confidence },
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
            <Ionicons name="document-text-outline" size={20} color="#0066CC" />
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
    backgroundColor: "#F5F5F7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C1C1E",
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  xrayImage: {
    width: "100%",
    height: 300,
    borderRadius: 8,
    backgroundColor: "#F5F5F7",
  },
  predictionCard: {
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    alignItems: "center",
    borderWidth: 2,
  },
  predictionDanger: {
    backgroundColor: "#FFEBEE",
    borderColor: "#D32F2F",
  },
  predictionSafe: {
    backgroundColor: "#E8F5E9",
    borderColor: "#4CAF50",
  },
  predictionIcon: {
    marginBottom: 16,
  },
  predictionText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  textDanger: {
    color: "#D32F2F",
  },
  textSafe: {
    color: "#4CAF50",
  },
  predictionSubtext: {
    fontSize: 14,
    color: "#636366",
  },
  confidenceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  confidenceLabel: {
    fontSize: 14,
    color: "#636366",
    marginBottom: 8,
  },
  confidenceValue: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginBottom: 16,
  },
  confidenceBar: {
    width: "100%",
    height: 8,
    backgroundColor: "#E5E5EA",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 12,
  },
  confidenceBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  confidenceDescription: {
    fontSize: 14,
    fontWeight: "600",
    color: "#636366",
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F7",
  },
  infoLabel: {
    fontSize: 14,
    color: "#636366",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  disclaimerBox: {
    backgroundColor: "#FFF3CD",
    borderWidth: 2,
    borderColor: "#FFE69C",
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
    fontWeight: "bold",
    color: "#856404",
  },
  disclaimerText: {
    fontSize: 13,
    color: "#856404",
    lineHeight: 20,
  },
  actionButtons: {
    gap: 12,
  },
  primaryButton: {
    flexDirection: "row",
    backgroundColor: "#0066CC",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
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
    borderColor: "#0066CC",
  },
  secondaryButtonText: {
    color: "#0066CC",
    fontSize: 16,
    fontWeight: "bold",
  },
  tertiaryButton: {
    backgroundColor: "transparent",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  tertiaryButtonText: {
    color: "#0066CC",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomSpacer: {
    height: 40,
  },
});