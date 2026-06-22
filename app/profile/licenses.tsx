import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, BORDER_RADIUS, SHADOWS } from "../../constants/Theme";

export default function LicensesScreen() {
  const insets = useSafeAreaInsets();

  const dependencies = [
    { name: "React Native", license: "MIT License", copyright: "Copyright © Meta Platforms, Inc." },
    { name: "Expo & Expo Router", license: "MIT License", copyright: "Copyright © 2015-present 650 Industries" },
    { name: "React Native Reanimated", license: "MIT License", copyright: "Copyright © 2016-present Software Mansion" },
    { name: "Axios", license: "MIT License", copyright: "Copyright © 2014-present Matt Zabriskie" },
    { name: "Expo Secure Store", license: "MIT License", copyright: "Copyright © 2019-present 650 Industries" },
  ];

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
            <Text style={styles.headerTitle}>Licenses</Text>
            <Text style={styles.headerSubtitle}>Open Source Credits</Text>
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
          <Text style={styles.introText}>
            PneumoDetect AI is built with open-source software libraries. We thank the developers and maintainers of these tools.
          </Text>

          {dependencies.map((dep, index) => (
            <View key={dep.name}>
              {index > 0 && <View style={styles.divider} />}
              <View style={styles.licenseItem}>
                <Text style={styles.depName}>{dep.name}</Text>
                <Text style={styles.depLicense}>{dep.license}</Text>
                <Text style={styles.depCopyright}>{dep.copyright}</Text>
              </View>
            </View>
          ))}
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
  card: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
    ...SHADOWS.light,
  },
  introText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "600",
    marginBottom: 16,
    lineHeight: 18,
  },
  licenseItem: {
    paddingVertical: 12,
  },
  depName: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  depLicense: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
    marginTop: 4,
  },
  depCopyright: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: "500",
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 8,
  },
  bottomSpacer: {
    height: 40,
  },
});
