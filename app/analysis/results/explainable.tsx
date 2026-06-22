import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, BORDER_RADIUS, SHADOWS, SPACING } from "../../../constants/Theme";

export default function ExplainableAIScreen() {
  const insets = useSafeAreaInsets();
  const { scanId, imageUri, result, confidence, heatmapUrl } = useLocalSearchParams();
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [opacity, setOpacity] = useState(0.6);

  const isPneumonia = result === "PNEUMONIA";
  const predictionText = isPneumonia ? "Pneumonia Detected" : "Normal";

  const heatmapUri = (heatmapUrl as string) || "https://via.placeholder.com/400x400/FF0000/FFFFFF?text=Heatmap";

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top + 8 : 16 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Explainable AI</Text>
          <Text style={styles.headerSubtitle}>Grad-CAM Visualization</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Info Banner */}
        <View style={styles.infoCard}>
          <Ionicons name="bulb-outline" size={22} color={COLORS.primary} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>How to read this</Text>
            <Text style={styles.infoText}>
              The heatmap highlights regions the AI focused on. Red/warm areas indicate higher influence on the prediction.
            </Text>
          </View>
        </View>

        {/* X-ray + Heatmap Overlay */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri as string }} style={styles.baseImage} />
          {showHeatmap && (
            <Image source={{ uri: heatmapUri }} style={[styles.heatmapOverlay, { opacity }]} />
          )}
        </View>

        {/* Controls Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Visualization Controls</Text>

          <View style={styles.controlRow}>
            <View style={styles.controlLabel}>
              <Ionicons name="eye-outline" size={20} color={COLORS.textSecondary} />
              <Text style={styles.controlLabelText}>Show Heatmap</Text>
            </View>
            <Switch
              value={showHeatmap}
              onValueChange={setShowHeatmap}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          {showHeatmap && (
            <View style={styles.sliderContainer}>
              <View style={styles.sliderHeader}>
                <Text style={styles.sliderLabel}>Heatmap Opacity</Text>
                <Text style={styles.sliderValue}>{Math.round(opacity * 100)}%</Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1}
                value={opacity}
                onValueChange={setOpacity}
                minimumTrackTintColor={COLORS.primary}
                maximumTrackTintColor={COLORS.border}
                thumbTintColor={COLORS.primary}
              />
            </View>
          )}
        </View>

        {/* AI Summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>AI Analysis Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Prediction</Text>
            <Text style={[styles.summaryValue, isPneumonia ? styles.textDanger : styles.textSuccess]}>
              {predictionText}
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.noBorder]}>
            <Text style={styles.summaryLabel}>Confidence</Text>
            <Text style={styles.summaryValueNeutral}>{confidence}%</Text>
          </View>
        </View>

        {/* Color Guide */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📋 Interpretation Guide</Text>
          <View style={styles.legendItem}>
            <View style={[styles.colorDot, { backgroundColor: "#EF4444" }]} />
            <Text style={styles.legendText}>
              <Text style={styles.bold}>Hot (Red):</Text> High activation — areas most influential to the diagnosis
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.colorDot, { backgroundColor: "#EAB308" }]} />
            <Text style={styles.legendText}>
              <Text style={styles.bold}>Warm (Yellow):</Text> Moderate activation — supportive regions
            </Text>
          </View>
          <View style={[styles.legendItem, styles.noBorder]}>
            <View style={[styles.colorDot, { backgroundColor: "#3B82F6" }]} />
            <Text style={styles.legendText}>
              <Text style={styles.bold}>Cool (Blue):</Text> Low activation — less relevant areas
            </Text>
          </View>
        </View>

        {/* Clinical Note */}
        {isPneumonia && (
          <View style={styles.clinicalNote}>
            <Ionicons name="warning-outline" size={20} color={COLORS.danger} />
            <Text style={styles.clinicalNoteText}>
              The model detected abnormal patterns consistent with pneumonia, particularly in the highlighted regions. Recommend clinical correlation and follow-up.
            </Text>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
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
    paddingHorizontal: SPACING.md,
    paddingBottom: 16,
    backgroundColor: COLORS.card,
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
  headerTextContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontWeight: "500",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: COLORS.primaryLight,
    borderRadius: BORDER_RADIUS.md,
    padding: 14,
    marginBottom: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.primary,
    lineHeight: 19,
    fontWeight: "500",
  },
  imageContainer: {
    backgroundColor: "#000000",
    borderRadius: BORDER_RADIUS.md,
    overflow: "hidden",
    marginBottom: 16,
    position: "relative",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  baseImage: {
    width: "100%",
    height: 340,
  },
  heatmapOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 14,
    letterSpacing: -0.2,
  },
  controlRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  controlLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  controlLabelText: {
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  sliderContainer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: 10,
  },
  sliderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  sliderLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  sliderValue: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.primary,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "800",
  },
  summaryValueNeutral: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  textDanger: {
    color: COLORS.danger,
  },
  textSuccess: {
    color: COLORS.success,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  colorDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginTop: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  legendText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
    fontWeight: "500",
  },
  bold: {
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  clinicalNote: {
    flexDirection: "row",
    backgroundColor: COLORS.dangerLight,
    borderRadius: BORDER_RADIUS.md,
    padding: 14,
    gap: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.danger + "33",
  },
  clinicalNoteText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.danger,
    lineHeight: 20,
    fontWeight: "600",
  },
  bottomSpacer: {
    height: 40,
  },
});
