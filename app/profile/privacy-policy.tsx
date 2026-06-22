import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, BORDER_RADIUS, SHADOWS } from "../../constants/Theme";

export default function PrivacyPolicyScreen() {
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
            <Text style={styles.headerTitle}>Privacy Policy</Text>
            <Text style={styles.headerSubtitle}>Data Safeguards</Text>
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
          <Text style={styles.sectionTitle}>1. Data Confidentiality</Text>
          <Text style={styles.bodyText}>
            PneumoDetect AI is designed strictly for clinical decision support. All chest X-ray scans, patient demographic files, and diagnostic notes are encrypted using industry-standard protocols both in transit and at rest.
          </Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>2. Scan Storage & Cache</Text>
          <Text style={styles.bodyText}>
            Scans submitted to the screening models are stored on secure workspace servers to generate the Grad-CAM heatmaps and diagnostic reports. Clinicians retain full ownership over their workspace screening history and can delete patient logs at any time.
          </Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>3. Local Processing & Audits</Text>
          <Text style={styles.bodyText}>
            System activity logging is used strictly for authentication validation and internal quality checks. PneumoDetect AI contains zero commercial advertising trackers, cookies, or third-party marketing integration.
          </Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>4. Clinician Access Only</Text>
          <Text style={styles.bodyText}>
            Only authenticated medical personnel, administrators, and approved supervisors are authorized to view or manage patient screenings within the workspace portal. Secure tokens ensure that credentials remain isolated and tamper-proof.
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
