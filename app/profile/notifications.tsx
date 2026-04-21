import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
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
  SettingRow,
} from "../../components/premium/PremiumComponents";

export default function NotificationsScreen() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [scanAlerts, setScanAlerts] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);
  const [monthlyDigest, setMonthlyDigest] = useState(true);
  const [criticalAlerts, setCriticalAlerts] = useState(true);
  const [specialOffers, setSpecialOffers] = useState(false);

  const handleSave = () => {
    Alert.alert("Success", "Notification preferences saved successfully!");
  };

  const handleReset = () => {
    Alert.alert(
      "Reset Preferences",
      "Restore all notification settings to default?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            setEmailNotifications(true);
            setPushNotifications(true);
            setScanAlerts(true);
            setWeeklyReports(false);
            setMonthlyDigest(true);
            setCriticalAlerts(true);
            setSpecialOffers(false);
            Alert.alert("Success", "Settings reset to defaults");
          },
        },
      ],
    );
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
            <Text style={styles.headerTitle}>Notifications</Text>
            <Text style={styles.headerSubtitle}>Manage your preferences</Text>
          </View>
          <View style={styles.placeholder} />
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Smart Notifications Info */}
        <InfoCard
          icon="bulb-outline"
          title="Smart Notifications"
          description="We'll only send you relevant updates about your scans and account activity."
          type="info"
        />

        {/* Email Notifications Section */}
        <View style={styles.section}>
          <SectionHeader
            title="Email Notifications"
            subtitle="How we reach you via email"
          />
          <PremiumCard>
            <SettingRow
              icon="mail-outline"
              label="Email Notifications"
              description="Receive updates via email"
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              iconColor={COLORS.primary}
            />
            <SettingRow
              icon="document-text-outline"
              label="Weekly Reports"
              description="Summary of your activity"
              value={weeklyReports}
              onValueChange={setWeeklyReports}
              iconColor={COLORS.warning}
              isLast={false}
            />
            <SettingRow
              icon="calendar-outline"
              label="Monthly Digest"
              description="Monthly performance summary"
              value={monthlyDigest}
              onValueChange={setMonthlyDigest}
              iconColor={COLORS.warning}
              isLast={true}
            />
          </PremiumCard>
        </View>

        {/* Push Notifications Section */}
        <View style={styles.section}>
          <SectionHeader
            title="Push Notifications"
            subtitle="Real-time alerts on your device"
          />
          <PremiumCard>
            <SettingRow
              icon="phone-portrait-outline"
              label="Push Notifications"
              description="Get alerts on your device"
              value={pushNotifications}
              onValueChange={setPushNotifications}
              iconColor={COLORS.primary}
            />
            <SettingRow
              icon="alert-circle-outline"
              label="Scan Alerts"
              description="Urgent scan notifications"
              value={scanAlerts}
              onValueChange={setScanAlerts}
              iconColor={COLORS.danger}
              isLast={false}
            />
            <SettingRow
              icon="warning-outline"
              label="Critical Alerts"
              description="High-priority notifications"
              value={criticalAlerts}
              onValueChange={setCriticalAlerts}
              iconColor={COLORS.danger}
              isLast={true}
            />
          </PremiumCard>
        </View>

        {/* Marketing Preferences Section */}
        <View style={styles.section}>
          <SectionHeader
            title="Marketing"
            subtitle="Optional promotional content"
          />
          <PremiumCard>
            <SettingRow
              icon="gift-outline"
              label="Special Offers"
              description="Receive exclusive deals and promotions"
              value={specialOffers}
              onValueChange={setSpecialOffers}
              iconColor={COLORS.success}
              isLast={true}
            />
          </PremiumCard>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonSection}>
          <PrimaryButton
            label="Save Preferences"
            onPress={handleSave}
            icon="checkmark-circle"
          />
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleReset}
          >
            <Ionicons name="refresh-outline" size={18} color={COLORS.primary} />
            <Text style={styles.secondaryButtonText}>Reset to Defaults</Text>
          </TouchableOpacity>
        </View>

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
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
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
  buttonSection: {
    marginTop: 12,
    marginBottom: 12,
  },
  secondaryButton: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginVertical: 12,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.primary,
    letterSpacing: -0.3,
  },
});
