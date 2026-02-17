import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

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

const TUTORIAL_ITEMS = [
  {
    icon: "cloud-upload-outline",
    title: "Uploading X-Rays",
    description: "Learn how to upload and analyze chest X-rays",
  },
  {
    icon: "analytics-outline",
    title: "Understanding Results",
    description: "Interpret AI predictions and confidence scores",
  },
  {
    icon: "document-text-outline",
    title: "Generating Reports",
    description: "Create and share professional PDF reports",
  },
  {
    icon: "people-outline",
    title: "User Management",
    description: "Add and manage team members (Admin only)",
  },
];

export default function HelpCenterScreen() {
  const handleTutorial = (title: string) => {
    Alert.alert(title, "Tutorial video will open here");
  };

  const handleContactSupport = () => {
    router.push("/profile/contact");
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
            <Ionicons name="arrow-back" size={24} color="#0066CC" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Help Center</Text>
            <Text style={styles.headerSubtitle}>Get support & tutorials</Text>
          </View>
          <View style={styles.placeholder} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
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
            <TouchableOpacity
              style={[styles.quickActionButton, styles.secondaryAction]}
              onPress={() => Alert.alert("User Guide", "Download user manual")}
            >
              <Ionicons name="book-outline" size={24} color="#0066CC" />
              <Text style={styles.secondaryActionText}>User Guide</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Video Tutorials */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Video Tutorials</Text>
          <View style={styles.card}>
            {TUTORIAL_ITEMS.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.tutorialItem}
                onPress={() => handleTutorial(item.title)}
              >
                <View style={styles.tutorialLeft}>
                  <View style={styles.tutorialIcon}>
                    <Ionicons name={item.icon as any} size={24} color="#0066CC" />
                  </View>
                  <View style={styles.tutorialText}>
                    <Text style={styles.tutorialTitle}>{item.title}</Text>
                    <Text style={styles.tutorialDescription}>
                      {item.description}
                    </Text>
                  </View>
                </View>
                <Ionicons name="play-circle" size={32} color="#0066CC" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* FAQ */}
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
  tutorialItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F7",
  },
  tutorialLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  tutorialIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
  },
  tutorialText: {
    flex: 1,
  },
  tutorialTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  tutorialDescription: {
    fontSize: 13,
    color: "#8E8E93",
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
  bottomSpacer: {
    height: 40,
  },
});