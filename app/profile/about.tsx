import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, BORDER_RADIUS, SHADOWS, SPACING } from "../../constants/Theme";
import { Card } from "../../components/premium";

export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  const handlePrivacyPolicy = () => {
    router.push("/profile/privacy-policy");
  };

  const handleTerms = () => {
    router.push("/profile/terms");
  };

  const handleLicense = () => {
    router.push("/profile/licenses");
  };

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
            <Text style={styles.headerTitle}>About</Text>
            <Text style={styles.headerSubtitle}>App Information</Text>
          </View>
          <View style={styles.placeholder} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* App Title & Logo */}
        <View style={styles.appInfoSection}>
          <View style={styles.appIcon}>
            <Ionicons name="medical-outline" size={48} color={COLORS.primary} />
          </View>
          <Text style={styles.appName}>PneumoDetect AI</Text>
          <Text style={styles.appVersion}>Version 1.0</Text>
          <Text style={styles.appTagline}>
            AI-powered pneumonia detection for chest X-ray screening.
          </Text>
        </View>

        {/* Clinical Intent Notice */}
        <View style={styles.section}>
          <Card elevated="light" style={styles.card}>
            <Text style={styles.bodyText}>
              Developed as a clinical decision support platform.
            </Text>
          </Card>
        </View>

        {/* Legal Links Card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal & Compliance</Text>
          <View style={styles.menuCard}>
            <TouchableOpacity
              style={styles.legalItem}
              onPress={handlePrivacyPolicy}
            >
              <Ionicons
                name="document-text-outline"
                size={20}
                color={COLORS.primary}
              />
              <Text style={styles.legalText}>Privacy Policy</Text>
              <Ionicons name="chevron-forward" size={18} color={COLORS.textTertiary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.legalItem} onPress={handleTerms}>
              <Ionicons name="shield-outline" size={20} color={COLORS.primary} />
              <Text style={styles.legalText}>Terms of Service</Text>
              <Ionicons name="chevron-forward" size={18} color={COLORS.textTertiary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.legalItem} onPress={handleLicense}>
              <Ionicons name="key-outline" size={20} color={COLORS.primary} />
              <Text style={styles.legalText}>Open Source Licenses</Text>
              <Ionicons name="chevron-forward" size={18} color={COLORS.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Copyright */}
        <View style={styles.copyright}>
          <Text style={styles.copyrightText}>
            © 2026 PneumoDetect AI. All rights reserved.
          </Text>
          <Text style={styles.copyrightSubtext}>
            Clinical Decision Support System
          </Text>
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
  appInfoSection: {
    backgroundColor: COLORS.card,
    alignItems: "center",
    paddingVertical: 36,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 24,
    ...SHADOWS.light,
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    ...SHADOWS.light,
  },
  appName: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  appVersion: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "700",
    marginBottom: 8,
  },
  appTagline: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    paddingHorizontal: 32,
    fontWeight: "600",
    lineHeight: 20,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.textSecondary,
    marginBottom: 12,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  card: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
    padding: 16,
    ...SHADOWS.light,
  },
  bodyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
    textAlign: "center",
    fontWeight: "600",
  },
  menuCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  legalItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  legalText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  copyright: {
    alignItems: "center",
    paddingVertical: 24,
  },
  copyrightText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "600",
    marginBottom: 4,
  },
  copyrightSubtext: {
    fontSize: 11,
    color: COLORS.textTertiary,
    fontWeight: "600",
  },
  bottomSpacer: {
    height: 40,
  },
});
