import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  COLORS,
  InfoCard,
  PremiumCard,
  PrimaryButton,
  SectionHeader,
} from "../../components/premium/PremiumComponents";

const FAQ_DATA = [
  {
    question: "How do I upload an X-ray image?",
    answer:
      "Navigate to 'New Scan' from the dashboard, then choose 'Upload Image' or 'Take Photo'. Ensure the image is clear and shows the full chest area.",
  },
  {
    question: "How accurate is the AI diagnosis?",
    answer:
      "Our AI model has been trained on thousands of chest X-rays and maintains an accuracy rate of 94.5%. However, all results should be verified by a qualified medical professional.",
  },
  {
    question: "Can I download scan reports?",
    answer:
      "Yes! Go to any scan result and tap 'Generate PDF' to create a downloadable report. You can also share it directly from the app.",
  },
  {
    question: "How do I manage users? (Admin only)",
    answer:
      "Admins can access User Management from the dashboard. You can add, edit, deactivate, or remove users from there.",
  },
  {
    question: "Is my patient data secure?",
    answer:
      "Absolutely. All data is encrypted end-to-end and stored securely. We comply with HIPAA and GDPR regulations.",
  },
];

const USER_GUIDE_SECTIONS = [
  {
    icon: "cloud-upload-outline",
    title: "Uploading X-Rays",
    content:
      "1. Tap 'New Scan' on the dashboard\n2. Select 'Upload Image' or 'Take Photo'\n3. Choose a clear chest X-ray image\n4. Review the image and tap 'Analyze'\n5. Wait for AI analysis to complete",
  },
  {
    icon: "analytics-outline",
    title: "Understanding Results",
    content:
      "• Confidence Score: How confident the AI is in its prediction\n• Status: Pneumonia detected or Normal\n• Heatmap: Shows areas of concern highlighted in red\n• Always consult a medical professional for final diagnosis",
  },
  {
    icon: "document-text-outline",
    title: "Generating Reports",
    content:
      "1. Go to any completed scan\n2. Tap the 'Generate PDF' button\n3. Review the report\n4. Share via email or save to device\n5. Reports include patient info, results, and heatmap",
  },
  {
    icon: "people-outline",
    title: "User Management (Admin)",
    content:
      "1. Access Admin Dashboard\n2. Tap 'Manage Users'\n3. Add new users: Fill email, name, and role\n4. Edit: Tap user to modify details\n5. Remove: Swipe left and confirm deletion",
  },
  {
    icon: "shield-checkmark-outline",
    title: "Security & Privacy",
    content:
      "• All data is encrypted end-to-end\n• HIPAA and GDPR compliant\n• Change password in Privacy & Security settings\n• Activity logs available in profile\n• Never share your login credentials",
  },
];

export default function HelpCenterScreen() {
  const [expandedGuide, setExpandedGuide] = React.useState<number | null>(null);

  const handleContactSupport = () => {
    router.push("/profile/contact");
  };

  const handleUserGuidePress = (index: number) => {
    setExpandedGuide(expandedGuide === index ? null : index);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Help Center</Text>
            <Text style={styles.headerSubtitle}>Get support & resources</Text>
          </View>
          <View style={styles.placeholder} />
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Action Section */}
        <SectionHeader title="Quick Actions" subtitle="Get help in seconds" />
        <PremiumCard>
          <PrimaryButton
            label="Contact Support"
            icon="mail-outline"
            onPress={handleContactSupport}
          />
        </PremiumCard>

        {/* User Guide Section */}
        <SectionHeader title="User Guide" subtitle="Step-by-step tutorials" />
        <PremiumCard>
          {USER_GUIDE_SECTIONS.map((section, index) => (
            <View key={index}>
              <TouchableOpacity
                style={styles.guideItemHeader}
                onPress={() => handleUserGuidePress(index)}
              >
                <View style={styles.guideItemLeft}>
                  <View
                    style={[
                      styles.guideIcon,
                      { backgroundColor: COLORS.primary + "15" },
                    ]}
                  >
                    <Ionicons
                      name={section.icon as any}
                      size={24}
                      color={COLORS.primary}
                    />
                  </View>
                  <Text style={styles.guideItemTitle}>{section.title}</Text>
                </View>
                <Ionicons
                  name={expandedGuide === index ? "chevron-up" : "chevron-down"}
                  size={24}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
              {expandedGuide === index && (
                <View
                  style={[
                    styles.guideItemContent,
                    { backgroundColor: COLORS.background },
                  ]}
                >
                  <Text
                    style={[
                      styles.guideContentText,
                      { color: COLORS.textSecondary },
                    ]}
                  >
                    {section.content}
                  </Text>
                </View>
              )}
              {index < USER_GUIDE_SECTIONS.length - 1 && (
                <View
                  style={[styles.divider, { backgroundColor: COLORS.border }]}
                />
              )}
            </View>
          ))}
        </PremiumCard>

        {/* FAQ Section */}
        <SectionHeader
          title="Frequently Asked Questions"
          subtitle="Common questions answered"
        />
        <PremiumCard>
          {FAQ_DATA.map((faq, index) => (
            <View key={index}>
              <View style={styles.faqItem}>
                <View style={styles.faqQuestion}>
                  <View
                    style={[
                      styles.faqIcon,
                      { backgroundColor: COLORS.success + "15" },
                    ]}
                  >
                    <Ionicons
                      name="help-circle-outline"
                      size={20}
                      color={COLORS.success}
                    />
                  </View>
                  <Text
                    style={[
                      styles.faqQuestionText,
                      { color: COLORS.textPrimary },
                    ]}
                  >
                    {faq.question}
                  </Text>
                </View>
                <Text
                  style={[styles.faqAnswer, { color: COLORS.textSecondary }]}
                >
                  {faq.answer}
                </Text>
              </View>
              {index < FAQ_DATA.length - 1 && (
                <View
                  style={[styles.divider, { backgroundColor: COLORS.border }]}
                />
              )}
            </View>
          ))}
        </PremiumCard>

        {/* Support Info Card */}
        <InfoCard
          icon="help-buoy-outline"
          title="Still Need Help?"
          description="Can't find what you're looking for? Contact our support team directly. We're here to assist you 24/7."
          type="info"
        />

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 50,
  },
  header: {
    backgroundColor: COLORS.card,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
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
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTextContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "500",
    marginTop: 2,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textSecondary,
    marginBottom: 12,
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  guideItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  guideItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  guideIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  guideItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    flex: 1,
  },
  guideItemContent: {
    padding: 16,
    paddingTop: 12,
    backgroundColor: COLORS.background,
  },
  guideContentText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
    fontWeight: "500",
  },
  faqItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  faqQuestion: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  faqIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  faqQuestionText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
    flex: 1,
  },
  faqAnswer: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginLeft: 48,
    fontWeight: "500",
  },
  bottomSpacer: {
    height: 40,
  },
});
