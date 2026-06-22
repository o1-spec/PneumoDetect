import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, BORDER_RADIUS, SHADOWS } from "../../constants/Theme";

export default function TermsScreen() {
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
            <Text style={styles.headerTitle}>Terms of Service</Text>
            <Text style={styles.headerSubtitle}>Usage Agreement</Text>
          </View>
          <View style={styles.placeholder} />
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>1. Scope of Service</Text>
          <Text style={styles.bodyText}>
            PneumoDetect AI is a clinical decision support application designed solely for screening assistance. It is NOT a diagnostic service and must not be used as a stand-alone tool for diagnostic determinations.
          </Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>2. Clinician Qualifications</Text>
          <Text style={styles.bodyText}>
            This application is intended for use by qualified healthcare workers, radiologists, researchers, and supervised medical students. Users are responsible for exercising independent clinical judgment before making treatment plans or patient recommendations.
          </Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>3. Account Security</Text>
          <Text style={styles.bodyText}>
            Clinicians must safeguard their workspace login details, device keys, and pin identifiers. Unauthorized credential sharing is strictly prohibited. Activity logs trace login events to safeguard database endpoints.
          </Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>4. Disclaimer of Liability</Text>
          <Text style={styles.bodyText}>
            The system developers, sponsors, and partners make no representations or warranties regarding model predictions. Under no circumstances will PneumoDetect AI be liable for direct or indirect clinical errors resulting from image scanning outputs.
          </Text>
        </View>

        <Text style={styles.footerText}>Last updated: June 22, 2026</Text>
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
  card: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
    ...SHADOWS.light,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  bodyText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  footerText: {
    fontSize: 11,
    color: COLORS.textTertiary,
    textAlign: "center",
    marginTop: 24,
    fontWeight: "600",
  },
  bottomSpacer: {
    height: 40,
  },
});
