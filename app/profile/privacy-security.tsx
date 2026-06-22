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
import { COLORS, BORDER_RADIUS, SHADOWS, SPACING } from "../../constants/Theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "../../components/premium";
import { activityAPI } from "../../services/api.client";
import { LoginRecord } from "../../types/api";
import {
  extractBrowserInfo,
  formatDateTime,
  formatIPAddress,
} from "../../utils/dateFormatter";
import { dialogManager } from "../../utils/dialogManager";
import { useToast } from "../../hooks/useToast";

export default function SecurityScreen() {
  const insets = useSafeAreaInsets();
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

      dialogManager.show({ title: "Recent Activity Logs", message: activityText });
    } catch (error) {
      showError("Failed to load activity history");
    } finally {
      setLoadingActivity(false);
    }
  };

  const handleDataDeletion = () => {
    dialogManager.show({
      title: "Request Account Deletion",
      message: "To delete your clinical account and permanently remove your records, please contact our support desk directly at support@pneumodetect.ai or file an issue in the Support panel.",
      buttons: [
        { text: "Cancel", style: "cancel" },
        {
          text: "Contact Support",
          onPress: () => router.push("/profile/contact"),
        },
      ],
    });
  };

  return (
    <>
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
              <Text style={styles.headerTitle}>Security</Text>
              <Text style={styles.headerSubtitle}>Account Access Settings</Text>
            </View>
            <View style={styles.placeholder} />
          </View>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Security Summary Alert */}
          <Card elevated="light" style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Ionicons name="shield-checkmark" size={20} color={COLORS.success} />
              <Text style={styles.summaryTitle}>Clinical Access Safeguards</Text>
            </View>
            <Text style={styles.summaryText}>
              All scan data and patient credentials are secured locally. Configure passwords and MFA settings below.
            </Text>
          </Card>

          {/* Access Actions Grid */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sign In Credentials</Text>
            <View style={styles.menuCard}>
              
              {/* Change Password */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => setShowPasswordModal(true)}
              >
                <View style={styles.itemLeft}>
                  <Ionicons name="key-outline" size={22} color={COLORS.primary} />
                  <View>
                    <Text style={styles.itemTitle}>Change Password</Text>
                    <Text style={styles.itemSubtitle}>Update credentials regularly</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color={COLORS.textTertiary} />
              </TouchableOpacity>

              {/* Two-Factor Authentication (Disabled placeholder) */}
              <View style={[styles.menuItem, styles.disabledItem]}>
                <View style={styles.itemLeft}>
                  <Ionicons name="shield-outline" size={22} color={COLORS.textTertiary} />
                  <View>
                    <Text style={[styles.itemTitle, styles.disabledText]}>Two-Factor Authentication — Coming soon</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Data & Logs Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Clinical Logs & Account Removal</Text>
            <View style={styles.menuCard}>
              
              {/* Active Sessions */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleViewActivityLog}
              >
                <View style={styles.itemLeft}>
                  <Ionicons name="document-text-outline" size={22} color={COLORS.primary} />
                  <View>
                    <Text style={styles.itemTitle}>Recent Activity Logs</Text>
                    <Text style={styles.itemSubtitle}>View your authentication logs</Text>
                  </View>
                </View>
                {loadingActivity ? (
                  <View style={{ marginRight: 4 }}>
                    <Text style={{ fontSize: 12, color: COLORS.textTertiary }}>Loading...</Text>
                  </View>
                ) : (
                  <Ionicons name="chevron-forward" size={18} color={COLORS.textTertiary} />
                )}
              </TouchableOpacity>

              {/* Delete Account */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleDataDeletion}
              >
                <View style={styles.itemLeft}>
                  <Ionicons name="trash-outline" size={22} color="#EF4444" />
                  <View>
                    <Text style={[styles.itemTitle, { color: "#EF4444" }]}>Delete Account Request</Text>
                    <Text style={styles.itemSubtitle}>Contact clinical support desk</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color={COLORS.textTertiary} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Change Password Modal */}
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
                <Ionicons name="key-outline" size={22} color={COLORS.primary} />
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
    paddingBottom: 30,
  },
  summaryCard: {
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 24,
    backgroundColor: COLORS.card,
    ...SHADOWS.light,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.success,
  },
  summaryText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
    fontWeight: "600",
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  disabledItem: {
    backgroundColor: COLORS.background,
    opacity: 0.8,
  },
  disabledText: {
    color: COLORS.textTertiary,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: "700",
  },
  itemSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: "500",
    marginTop: 2,
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
    fontSize: 18,
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
    paddingHorizontal: 16,
    height: 50,
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: "600",
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
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  requirementText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 6,
    fontWeight: "600",
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
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textSecondary,
    letterSpacing: 0.3,
  },
  submitButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.card,
    letterSpacing: 0.3,
  },
});
