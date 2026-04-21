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
import {
  COLORS,
  InfoCard,
  PremiumCard,
  PrimaryButton,
  SectionHeader,
} from "../../components/premium/PremiumComponents";
import { messagesAPI } from "../../services/api.client";
import { dialogManager } from "../../utils/dialogManager";
import { useToast } from "../../hooks/useToast";

export default function ContactScreen() {
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

  const handleCall = () => {
    Linking.openURL("tel:+2347058266972");
  };

  const handleEmail = () => {
    Linking.openURL("mailto:oluwafemionadokun@gmail.com");
  };

  const handleWebsite = () => {
    Linking.openURL("https://pneumoscan.vercel.app");
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
            <Text style={styles.headerTitle}>Contact Support</Text>
            <Text style={styles.headerSubtitle}>We're here to help</Text>
          </View>
          <View style={styles.placeholder} />
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader
          title="Get in Touch"
          subtitle="Choose your preferred contact method"
        />
        <PremiumCard>
          <TouchableOpacity style={styles.contactMethod} onPress={handleCall}>
            <View style={styles.contactLeft}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: COLORS.success + "20" },
                ]}
              >
                <Ionicons name="call" size={24} color={COLORS.success} />
              </View>
              <View style={styles.contactText}>
                <Text
                  style={[styles.contactLabel, { color: COLORS.textPrimary }]}
                >
                  Phone Support
                </Text>
                <Text style={[styles.contactValue, { color: COLORS.primary }]}>
                  +234 705 826 6972
                </Text>
                <Text
                  style={[styles.contactHours, { color: COLORS.textSecondary }]}
                >
                  Mon-Fri, 9AM-6PM EST
                </Text>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={COLORS.textTertiary}
            />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: COLORS.border }]} />

          <TouchableOpacity style={styles.contactMethod} onPress={handleEmail}>
            <View style={styles.contactLeft}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: COLORS.primary + "20" },
                ]}
              >
                <Ionicons name="mail" size={24} color={COLORS.primary} />
              </View>
              <View style={styles.contactText}>
                <Text
                  style={[styles.contactLabel, { color: COLORS.textPrimary }]}
                >
                  Email Support
                </Text>
                <Text
                  style={[styles.contactValue, { color: COLORS.primary }]}
                  numberOfLines={1}
                >
                  oluwafemionadokun@gmail.com
                </Text>
                <Text
                  style={[styles.contactHours, { color: COLORS.textSecondary }]}
                >
                  Response within 24 hours
                </Text>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={COLORS.textTertiary}
            />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: COLORS.border }]} />

          <TouchableOpacity
            style={styles.contactMethod}
            onPress={handleWebsite}
          >
            <View style={styles.contactLeft}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: COLORS.warning + "20" },
                ]}
              >
                <Ionicons name="globe" size={24} color={COLORS.warning} />
              </View>
              <View style={styles.contactText}>
                <Text
                  style={[styles.contactLabel, { color: COLORS.textPrimary }]}
                >
                  Website
                </Text>
                <Text style={[styles.contactValue, { color: COLORS.primary }]}>
                  pneumoscan.ai
                </Text>
                <Text
                  style={[styles.contactHours, { color: COLORS.textSecondary }]}
                >
                  Visit our website
                </Text>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={COLORS.textTertiary}
            />
          </TouchableOpacity>
        </PremiumCard>

        <SectionHeader
          title="Send Us a Message"
          subtitle="We'll get back to you soon"
        />
        <PremiumCard>
          <View style={styles.formGroup}>
            <Text style={[styles.formLabel, { color: COLORS.textPrimary }]}>
              Subject
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: COLORS.background,
                  borderColor: COLORS.border,
                  color: COLORS.textPrimary,
                },
              ]}
              placeholder="What can we help you with?"
              placeholderTextColor={COLORS.textTertiary}
              value={subject}
              onChangeText={setSubject}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: COLORS.border }]} />

          <View style={styles.formGroup}>
            <Text style={[styles.formLabel, { color: COLORS.textPrimary }]}>
              Message
            </Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                {
                  backgroundColor: COLORS.background,
                  borderColor: COLORS.border,
                  color: COLORS.textPrimary,
                },
              ]}
              placeholder="Describe your issue or question..."
              placeholderTextColor={COLORS.textTertiary}
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.formGroup}>
            <PrimaryButton
              label={loading ? "Sending..." : "Send Message"}
              icon="send"
              onPress={handleSendMessage}
              disabled={loading}
            />
          </View>
        </PremiumCard>

        {/* Social Links Section */}
        <SectionHeader
          title="Follow Us"
          subtitle="Stay updated with our latest news"
        />
        <View style={styles.socialContainer}>
          <TouchableOpacity
            style={[styles.socialButton, { backgroundColor: "#1DA1F2" }]}
          >
            <Ionicons name="logo-twitter" size={24} color={COLORS.card} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.socialButton, { backgroundColor: "#0A66C2" }]}
          >
            <Ionicons name="logo-linkedin" size={24} color={COLORS.card} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.socialButton, { backgroundColor: "#1877F2" }]}
          >
            <Ionicons name="logo-facebook" size={24} color={COLORS.card} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.socialButton, { backgroundColor: "#E4405F" }]}
          >
            <Ionicons name="logo-instagram" size={24} color={COLORS.card} />
          </TouchableOpacity>
        </View>

        <InfoCard
          icon="time-outline"
          title="Response Time"
          description="We typically respond to messages within 24 hours. For urgent matters, please call our phone support line."
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
  contactMethod: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  contactLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  phoneIcon: {
    backgroundColor: COLORS.success + "20",
  },
  emailIcon: {
    backgroundColor: COLORS.primary + "20",
  },
  webIcon: {
    backgroundColor: COLORS.warning + "20",
  },
  contactText: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 14,
    color: COLORS.primary,
    marginBottom: 2,
    fontWeight: "600",
  },
  contactHours: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  formGroup: {
    padding: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 8,
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontWeight: "500",
  },
  textArea: {
    height: 120,
    paddingTop: 16,
  },
  sendButton: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    margin: 16,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.textTertiary,
    shadowOpacity: 0.1,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.card,
    letterSpacing: 0.3,
  },
  locationInfo: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  locationIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary + "15",
    justifyContent: "center",
    alignItems: "center",
  },
  locationText: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  locationAddress: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    fontWeight: "500",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 28,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  bottomSpacer: {
    height: 40,
  },
});
