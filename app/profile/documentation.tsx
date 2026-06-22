import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, BORDER_RADIUS, SHADOWS } from "../../constants/Theme";
import { Card } from "../../components/premium";

export default function DocumentationScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top + 8 : 16 }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Documentation</Text>
            <Text style={styles.headerSubtitle}>Platform Reference</Text>
          </View>
          <View style={styles.placeholder} />
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* System Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. System Overview</Text>
          <View style={styles.docCard}>
            <Text style={styles.bodyText}>
              PneumoDetect AI leverages advanced deep neural networks trained to detect consolidations, infiltrates, and other primary radiographic signs of pneumonia on chest X-ray scans.
            </Text>
          </View>
        </View>

        {/* X-Ray Quality Guidelines */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Scan Acquisition Guidelines</Text>
          <View style={styles.docCard}>
            <Text style={styles.subHeader}>Supported Projections</Text>
            <Text style={styles.bodyText}>
              • **PA View (Posteroanterior)**: Recommended for optimal visualization and alignment of lung borders.
            </Text>
            <Text style={styles.bodyText}>
              • **AP View (Anteroposterior)**: Supported; ideal for bedside or urgent screenings.
            </Text>

            <View style={styles.divider} />

            <Text style={styles.subHeader}>Image Criteria</Text>
            <Text style={styles.bodyText}>
              • Both lung fields must be fully visualized from the apices down to the costophrenic angles.
            </Text>
            <Text style={styles.bodyText}>
              • Image must be free of major rotation, artifacts, or extreme motion blur.
            </Text>
            <Text style={styles.bodyText}>
              • File formats supported: DICOM, PNG, and JPEG.
            </Text>
          </View>
        </View>

        {/* Interpreting Heatmaps */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. AI Results & Heatmaps</Text>
          <View style={styles.docCard}>
            <Text style={styles.subHeader}>Confidence Score</Text>
            <Text style={styles.bodyText}>
              The model calculates a probability index representing findings suggestive of pneumonia. High, Moderate, and Low confidence flags categorize the urgency of clinical reviews.
            </Text>

            <View style={styles.divider} />

            <Text style={styles.subHeader}>Grad-CAM Visualization</Text>
            <Text style={styles.bodyText}>
              Toggling the AI Overlay highlights regions contributing most heavily to the classification. Warmer colors (red, orange) signify areas with high consolidation features. Cold colors (blue) correspond to baseline lung parenchyma.
            </Text>
          </View>
        </View>

        {/* Clinical Disclaimer */}
        <View style={styles.section}>
          <Card elevated="light" style={styles.alertCard}>
            <View style={styles.alertHeader}>
              <Ionicons name="warning-outline" size={20} color={COLORS.danger} />
              <Text style={styles.alertTitle}>Clinical Limitations</Text>
            </View>
            <Text style={styles.alertText}>
              PneumoDetect AI is a diagnostic decision support tool. It is not intended to replace direct diagnostic consultation, independent clinical evaluations, or radiologists' official reads. Always cross-reference results with patient clinical presentations, blood counts, and auscultation findings.
            </Text>
          </Card>
        </View>

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
    backgroundColor: COLORS.card,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...SHADOWS.light,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
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
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.textSecondary,
    marginBottom: 10,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  docCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    ...SHADOWS.light,
  },
  subHeader: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  alertCard: {
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    backgroundColor: COLORS.card,
    ...SHADOWS.light,
  },
  alertHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.danger,
  },
  alertText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
    fontWeight: "600",
  },
  bottomSpacer: {
    height: 40,
  },
});
