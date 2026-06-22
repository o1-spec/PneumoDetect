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
import { COLORS, BORDER_RADIUS, SHADOWS, SPACING } from "../../constants/Theme";
import { Card } from "../../components/premium";

export default function HelpCenterScreen() {
  const handleContactSupport = () => {
    router.push("/profile/contact");
  };

  const handleReportIssue = () => {
    router.push("/profile/contact");
  };

  const handleDocumentation = () => {
    Linking.openURL("https://pneumoscan.ai/docs");
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL("https://pneumoscan.ai/privacy");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Support</Text>
            <Text style={styles.headerSubtitle}>Need Help?</Text>
          </View>
          <View style={styles.placeholder} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Support Options Card */}
        <View style={styles.section}>
          <View style={styles.menuCard}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleContactSupport}
            >
              <View style={styles.itemLeft}>
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={22}
                  color={COLORS.primary}
                />
                <Text style={styles.itemText}>Contact Support</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={COLORS.textTertiary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleReportIssue}>
              <View style={styles.itemLeft}>
                <Ionicons name="alert-circle-outline" size={22} color={COLORS.primary} />
                <Text style={styles.itemText}>Report an Issue</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={COLORS.textTertiary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleDocumentation}>
              <View style={styles.itemLeft}>
                <Ionicons name="book-outline" size={22} color={COLORS.primary} />
                <Text style={styles.itemText}>Documentation</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={COLORS.textTertiary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handlePrivacyPolicy}>
              <View style={styles.itemLeft}>
                <Ionicons name="document-text-outline" size={22} color={COLORS.primary} />
                <Text style={styles.itemText}>Privacy Policy</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={COLORS.textTertiary} />
            </TouchableOpacity>
          </View>
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
    paddingTop: 60,
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
  section: {
    paddingHorizontal: 20,
    marginTop: 28,
  },
  menuCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  itemText: {
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  bottomSpacer: {
    height: 40,
  },
});
