import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, BORDER_RADIUS, SHADOWS } from "../../constants/Theme";
import { Card } from "../../components/premium";
import { useToast } from "../../hooks/useToast";
import { messagesAPI } from "../../services/api.client";
import { dialogManager } from "../../utils/dialogManager";

export default function ContactScreen() {
  const insets = useSafeAreaInsets();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { error: showError } = useToast();

  const handleSendMessage = async () => {
    if (!subject.trim() || !message.trim()) {
      showError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      await messagesAPI.send(subject.trim(), message.trim());

      dialogManager.show({
        title: "Message Sent",
        message: "Thank you for contacting us. We'll get back to you within 24 hours.",
        buttons: [
          {
            text: "OK",
            onPress: () => {
              setSubject("");
              setMessage("");
              router.back();
            },
          },
        ],
      });
    } catch (error) {
      showError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmail = () => {
    Linking.openURL("mailto:support@pneumodetect.ai");
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
            <Text style={styles.headerTitle}>Contact Support</Text>
            <Text style={styles.headerSubtitle}>Clinical Help Desk</Text>
          </View>
          <View style={styles.placeholder} />
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Support Channels */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Direct Inquiry</Text>
          <TouchableOpacity style={styles.emailCard} onPress={handleEmail}>
            <View style={styles.emailCardContent}>
              <View style={styles.iconContainer}>
                <Ionicons name="mail" size={24} color={COLORS.primary} />
              </View>
              <View style={styles.emailInfo}>
                <Text style={styles.emailLabel}>Email Support</Text>
                <Text style={styles.emailAddress}>support@pneumodetect.ai</Text>
                <Text style={styles.emailAvailability}>Response within 24 hours</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* Message Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Send message from workspace</Text>
          <View style={styles.formCard}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Subject</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="What is this regarding?"
                  placeholderTextColor={COLORS.textTertiary}
                  value={subject}
                  onChangeText={setSubject}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Message</Text>
              <View style={[styles.inputContainer, styles.textAreaContainer]}>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Describe your issue or question in detail..."
                  placeholderTextColor={COLORS.textTertiary}
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSendMessage}
              disabled={loading}
            >
              <Ionicons name="paper-plane-outline" size={18} color="#FFFFFF" />
              <Text style={styles.submitButtonText}>
                {loading ? "Sending Message..." : "Submit Support Message"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Support Alert Notice */}
        <Card elevated="light" style={styles.alertCard}>
          <View style={styles.alertHeader}>
            <Ionicons name="information-circle-outline" size={20} color={COLORS.primary} />
            <Text style={styles.alertTitle}>Response Times</Text>
          </View>
          <Text style={styles.alertText}>
            Our clinical decision support staff reviews messages Monday through Friday. If you are experiencing a technical platform failure or need account recovery support, please reach out via email for priority routing.
          </Text>
        </Card>

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
    paddingTop: 20,
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
  emailCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    ...SHADOWS.light,
  },
  emailCardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  emailInfo: {
    flex: 1,
  },
  emailLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  emailAddress: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.primary,
    marginTop: 2,
  },
  emailAvailability: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: "500",
    marginTop: 2,
  },
  formCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    ...SHADOWS.light,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 8,
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  textAreaContainer: {
    height: 120,
    paddingVertical: 12,
    alignItems: "flex-start",
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  textArea: {
    height: "100%",
  },
  submitButton: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
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
    color: COLORS.primary,
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
