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
            <Ionicons name="arrow-back" size={24} color="#0066CC" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Help Center</Text>
            <Text style={styles.headerSubtitle}>Get support & resources</Text>
          </View>
          <View style={styles.placeholder} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={handleContactSupport}
            >
              <Ionicons name="mail-outline" size={24} color="#FFFFFF" />
              <Text style={styles.quickActionText}>Contact Support</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User Guide</Text>
          <View style={styles.card}>
            {USER_GUIDE_SECTIONS.map((section, index) => (
              <View key={index}>
                <TouchableOpacity
                  style={styles.guideItemHeader}
                  onPress={() => handleUserGuidePress(index)}
                >
                  <View style={styles.guideItemLeft}>
                    <View style={styles.guideIcon}>
                      <Ionicons
                        name={section.icon as any}
                        size={24}
                        color="#0066CC"
                      />
                    </View>
                    <Text style={styles.guideItemTitle}>{section.title}</Text>
                  </View>
                  <Ionicons
                    name={
                      expandedGuide === index ? "chevron-up" : "chevron-down"
                    }
                    size={24}
                    color="#0066CC"
                  />
                </TouchableOpacity>
                {expandedGuide === index && (
                  <View style={styles.guideItemContent}>
                    <Text style={styles.guideContentText}>
                      {section.content}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.card}>
            {FAQ_DATA.map((faq, index) => (
              <View key={index} style={styles.faqItem}>
                <View style={styles.faqQuestion}>
                  <Ionicons
                    name="help-circle-outline"
                    size={20}
                    color="#0066CC"
                  />
                  <Text style={styles.faqQuestionText}>{faq.question}</Text>
                </View>
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              </View>
            ))}
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
    backgroundColor: "#F5F5F7",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
    backgroundColor: "#F5F5F7",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTextContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 2,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8E8E93",
    marginBottom: 12,
    marginLeft: 4,
  },
  quickActions: {
    flexDirection: "row",
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#0066CC",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#0066CC",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  secondaryAction: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#0066CC",
    shadowColor: "#000",
    shadowOpacity: 0.1,
  },
  secondaryActionText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0066CC",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  faqItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F7",
  },
  faqQuestion: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  faqQuestionText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1C1C1E",
    flex: 1,
  },
  faqAnswer: {
    fontSize: 14,
    color: "#636366",
    lineHeight: 20,
    marginLeft: 28,
  },
  guideItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F7",
  },
  guideItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  guideIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
  },
  guideItemTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1C1C1E",
    flex: 1,
  },
  guideItemContent: {
    padding: 16,
    paddingTop: 0,
    backgroundColor: "#F9F9FB",
  },
  guideContentText: {
    fontSize: 13,
    color: "#636366",
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 40,
  },
});
