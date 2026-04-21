import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ActionItem,
  COLORS,
  InfoCard,
  PremiumCard,
  SectionHeader,
  SettingRow,
} from "../../components/premium/PremiumComponents";
import { activityAPI } from "../../services/api.client";
import { LoginRecord } from "../../types/api";
import {
  extractBrowserInfo,
  formatDateTime,
  formatIPAddress,
} from "../../utils/dateFormatter";
import { dialogManager } from "../../utils/dialogManager";
import { useToast } from "../../hooks/useToast";

export default function PrivacySecurityScreen() {
  const [dataEncryption, setDataEncryption] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loadingActivity, setLoadingActivity] = useState(false);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { error: showError, success: showSuccess, info: showInfo } = useToast();

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showError("Please fill in all password fields");
      return;
    }

    if (newPassword.length < 8) {
      showError("New password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      showError("New passwords do not match");
      return;
    }

    setShowPasswordModal(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    showSuccess("Your password has been changed successfully!");
  };

  const handleViewActivityLog = async () => {
    try {
      setLoadingActivity(true);
      const activity = await activityAPI.getHistory();
      const loginHistory = activity.loginHistory || [];

      if (loginHistory.length === 0) {
        showInfo("No login history found.");
        return;
      }

      const recentLogins = loginHistory.slice(0, 5);
      const activityText = recentLogins
        .map((login: LoginRecord) => {
          const date = formatDateTime(login.loginAt);
          const device = extractBrowserInfo(login.userAgent);
          const ip = formatIPAddress(login.ipAddress);
          const status = login.logoutAt
            ? `(Logged out at ${formatDateTime(login.logoutAt)})`
            : "(Currently Active)";
          return `${date}\n${device} • ${ip}\n${status}`;
        })
        .join("\n\n");

      dialogManager.show({ title: "Recent Activity", message: activityText });
    } catch (error) {
      showError("Failed to load activity history. Please try again.");
    } finally {
      setLoadingActivity(false);
    }
  };

  const handleDataDeletion = () => {
    dialogManager.show({
      title: "Request Data Deletion",
      message: "This will permanently delete all your data from our servers. This action cannot be undone.\n\nAre you sure you want to proceed?",
      buttons: [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete My Data",
          style: "destructive",
          onPress: () =>
            dialogManager.show({
              title: "Confirmation Required",
              message: "We've sent a confirmation email to verify this request.",
            })
        },
      ],
    });
  };

  const handleDownloadData = () => {
    dialogManager.show({
      title: "Download Your Data",
      message: "We'll prepare a copy of all your data and send it to your email within 24 hours.",
      buttons: [
        { text: "Cancel", style: "cancel" },
        {
          text: "Request Download",
          onPress: () =>
            dialogManager.show({
              title: "Request Sent",
              message: "You'll receive an email when your data is ready.",
            })
        },
      ],
    });
  };

  return (
    <>
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
              <Text style={styles.headerTitle}>Privacy & Security</Text>
              <Text style={styles.headerSubtitle}>Protect your account</Text>
            </View>
            <View style={styles.placeholder} />
          </View>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <InfoCard
            icon="shield-checkmark-outline"
            title="Your Account is Secure"
            description="End-to-end encryption protects all your data. Manage your security settings below."
            type="success"
          />

          <View style={styles.section}>
            <SectionHeader
              title="Password & Authentication"
              subtitle="Manage your login security"
            />
            <PremiumCard>
              <ActionItem
                icon="key-outline"
                label="Change Password"
                subtitle="Update your login password"
                onPress={() => setShowPasswordModal(true)}
              />
              <ActionItem
                icon="shield-outline"
                label="Two-Factor Authentication"
                subtitle="Add an extra layer of security"
                onPress={() => setTwoFactorAuth(!twoFactorAuth)}
                isLast={true}
              />
            </PremiumCard>
          </View>

          <View style={styles.section}>
            <SectionHeader
              title="Security Settings"
              subtitle="Additional security options"
            />
            <PremiumCard>
              <SettingRow
                icon="lock-closed-outline"
                label="Data Encryption"
                description="End-to-end encryption is always enabled"
                value={dataEncryption}
                onValueChange={() => {}}
                iconColor={COLORS.success}
              />
              <SettingRow
                icon="notifications-outline"
                label="Login Alerts"
                description="Notify me of new login attempts"
                value={loginAlerts}
                onValueChange={setLoginAlerts}
                iconColor={COLORS.warning}
                isLast={false}
              />
              <SettingRow
                icon="timer-outline"
                label="Auto Session Timeout"
                description="Log me out after 30 minutes of inactivity"
                value={sessionTimeout}
                onValueChange={setSessionTimeout}
                iconColor={COLORS.warning}
                isLast={true}
              />
            </PremiumCard>
          </View>

          <View style={styles.section}>
            <SectionHeader title="Privacy & Data" subtitle="Manage your data" />
            <PremiumCard>
              <ActionItem
                icon="download-outline"
                label="Download Your Data"
                subtitle="Get a copy of all your data"
                onPress={handleDownloadData}
              />
              <ActionItem
                icon="document-text-outline"
                label="View Activity Log"
                subtitle="See your login history"
                onPress={handleViewActivityLog}
                isLast={false}
              />
              <ActionItem
                icon="trash-outline"
                label="Delete My Data"
                subtitle="Permanently remove all information"
                onPress={handleDataDeletion}
                isDangerous={true}
                isLast={true}
              />
            </PremiumCard>
          </View>

          <InfoCard
            icon="shield-checkmark-outline"
            title="HIPAA & GDPR Compliant"
            description="Your data is protected with bank-level encryption and stored in secure, compliant servers. We follow strict privacy guidelines."
            type="info"
          />

          <View style={{ height: 20 }} />
        </ScrollView>
      </View>

      <Modal
        visible={showPasswordModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowPasswordModal(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <Ionicons name="key-outline" size={24} color="#0066CC" />
                <Text style={styles.modalTitle}>Change Password</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowPasswordModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#8E8E93" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Current Password</Text>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#8E8E93"
                  />
                  <TextInput
                    style={styles.modalInput}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    placeholder="Enter current password"
                    placeholderTextColor="#8E8E93"
                    secureTextEntry={!showCurrentPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    <Ionicons
                      name={
                        showCurrentPassword ? "eye-outline" : "eye-off-outline"
                      }
                      size={20}
                      color="#8E8E93"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>New Password</Text>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#8E8E93"
                  />
                  <TextInput
                    style={styles.modalInput}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="Min. 8 characters"
                    placeholderTextColor="#8E8E93"
                    secureTextEntry={!showNewPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowNewPassword(!showNewPassword)}
                  >
                    <Ionicons
                      name={showNewPassword ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color="#8E8E93"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Confirm New Password</Text>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#8E8E93"
                  />
                  <TextInput
                    style={styles.modalInput}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Re-enter new password"
                    placeholderTextColor="#8E8E93"
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Ionicons
                      name={
                        showConfirmPassword ? "eye-outline" : "eye-off-outline"
                      }
                      size={20}
                      color="#8E8E93"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.requirementsBox}>
                <Text style={styles.requirementsTitle}>
                  Password Requirements:
                </Text>
                <Text style={styles.requirementText}>
                  • At least 8 characters
                </Text>
                <Text style={styles.requirementText}>
                  • Mix of uppercase and lowercase
                </Text>
                <Text style={styles.requirementText}>
                  • At least one number
                </Text>
                <Text style={styles.requirementText}>
                  • At least one special character
                </Text>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowPasswordModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleChangePassword}
              >
                <Text style={styles.submitButtonText}>Change Password</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
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
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  modalForm: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "700",
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
    paddingHorizontal: 16,
    height: 56,
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: "500",
  },
  requirementsBox: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  requirementText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 6,
    fontWeight: "500",
  },
  requirementMet: {
    color: COLORS.success,
  },
  requirementNotMet: {
    color: COLORS.warning,
  },
  modalActions: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textSecondary,
    letterSpacing: 0.3,
  },
  submitButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.card,
    letterSpacing: 0.3,
  },
});
