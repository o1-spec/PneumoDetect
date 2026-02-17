import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function PrivacySecurityScreen() {
  const [biometricAuth, setBiometricAuth] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(true);
  const [dataEncryption, setDataEncryption] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all password fields");
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert("Error", "New password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }

    setShowPasswordModal(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    Alert.alert("Success", "Your password has been changed successfully!");
  };

  const handleEnable2FA = () => {
    if (!twoFactorAuth) {
      Alert.alert(
        "Enable Two-Factor Authentication",
        "You will receive a verification code via email to complete setup.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Enable",
            onPress: () => {
              setTwoFactorAuth(true);
              Alert.alert(
                "2FA Enabled",
                "Two-factor authentication has been enabled. Check your email for the verification code."
              );
            },
          },
        ]
      );
    } else {
      Alert.alert(
        "Disable Two-Factor Authentication",
        "Are you sure you want to disable 2FA? This will make your account less secure.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Disable",
            style: "destructive",
            onPress: () => {
              setTwoFactorAuth(false);
              Alert.alert("2FA Disabled", "Two-factor authentication has been disabled.");
            },
          },
        ]
      );
    }
  };

  const handleViewActivityLog = () => {
    Alert.alert(
      "Recent Activity",
      "Last Login: Today at 9:23 AM\nLocation: San Francisco, CA\nDevice: iPhone 15 Pro\n\nPrevious Login: Yesterday at 3:45 PM\nLocation: San Francisco, CA\nDevice: MacBook Pro"
    );
  };

  const handleDataDeletion = () => {
    Alert.alert(
      "Request Data Deletion",
      "This will permanently delete all your data from our servers. This action cannot be undone.\n\nAre you sure you want to proceed?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete My Data",
          style: "destructive",
          onPress: () =>
            Alert.alert(
              "Confirmation Required",
              "We've sent a confirmation email to verify this request."
            ),
        },
      ]
    );
  };

  const handleDownloadData = () => {
    Alert.alert(
      "Download Your Data",
      "We'll prepare a copy of all your data and send it to your email within 24 hours.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Request Download",
          onPress: () =>
            Alert.alert("Request Sent", "You'll receive an email when your data is ready."),
        },
      ]
    );
  };

  return (
    <>
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
              <Text style={styles.headerTitle}>Privacy & Security</Text>
              <Text style={styles.headerSubtitle}>Protect your account</Text>
            </View>
            <View style={styles.placeholder} />
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Password & Authentication */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Password & Authentication</Text>
            <View style={styles.card}>
              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => setShowPasswordModal(true)}
              >
                <View style={styles.actionLeft}>
                  <View style={[styles.iconContainer, styles.passwordIcon]}>
                    <Ionicons name="key" size={22} color="#FF9800" />
                  </View>
                  <View style={styles.actionText}>
                    <Text style={styles.actionLabel}>Change Password</Text>
                    <Text style={styles.actionDescription}>
                      Update your account password
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
              </TouchableOpacity>

              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <View style={[styles.iconContainer, styles.twoFactorIcon]}>
                    <Ionicons name="shield-checkmark" size={22} color="#4CAF50" />
                  </View>
                  <View style={styles.settingText}>
                    <Text style={styles.settingLabel}>Two-Factor Authentication</Text>
                    <Text style={styles.settingDescription}>
                      {twoFactorAuth ? "Enabled" : "Add extra security"}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={twoFactorAuth}
                  onValueChange={handleEnable2FA}
                  trackColor={{ false: "#E5E5EA", true: "#4CAF50" }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <View style={[styles.iconContainer, styles.biometricIcon]}>
                    <Ionicons name="finger-print" size={22} color="#0066CC" />
                  </View>
                  <View style={styles.settingText}>
                    <Text style={styles.settingLabel}>Biometric Authentication</Text>
                    <Text style={styles.settingDescription}>
                      Use Face ID or Touch ID
                    </Text>
                  </View>
                </View>
                <Switch
                  value={biometricAuth}
                  onValueChange={setBiometricAuth}
                  trackColor={{ false: "#E5E5EA", true: "#0066CC" }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
          </View>

          {/* Security Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Security Settings</Text>
            <View style={styles.card}>
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <View style={[styles.iconContainer, styles.sessionIcon]}>
                    <Ionicons name="time" size={22} color="#9C27B0" />
                  </View>
                  <View style={styles.settingText}>
                    <Text style={styles.settingLabel}>Auto Session Timeout</Text>
                    <Text style={styles.settingDescription}>
                      Logout after 30 minutes of inactivity
                    </Text>
                  </View>
                </View>
                <Switch
                  value={sessionTimeout}
                  onValueChange={setSessionTimeout}
                  trackColor={{ false: "#E5E5EA", true: "#9C27B0" }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <View style={[styles.iconContainer, styles.encryptionIcon]}>
                    <Ionicons name="lock-closed" size={22} color="#D32F2F" />
                  </View>
                  <View style={styles.settingText}>
                    <Text style={styles.settingLabel}>End-to-End Encryption</Text>
                    <Text style={styles.settingDescription}>
                      All data is encrypted (Always On)
                    </Text>
                  </View>
                </View>
                <Switch
                  value={dataEncryption}
                  onValueChange={() => {}}
                  disabled
                  trackColor={{ false: "#E5E5EA", true: "#D32F2F" }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <TouchableOpacity
                style={styles.actionItem}
                onPress={handleViewActivityLog}
              >
                <View style={styles.actionLeft}>
                  <View style={[styles.iconContainer, styles.activityIcon]}>
                    <Ionicons name="list" size={22} color="#00BCD4" />
                  </View>
                  <View style={styles.actionText}>
                    <Text style={styles.actionLabel}>Recent Activity</Text>
                    <Text style={styles.actionDescription}>
                      View login history
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Privacy & Data */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Privacy & Data</Text>
            <View style={styles.card}>
              <TouchableOpacity
                style={styles.actionItem}
                onPress={handleDownloadData}
              >
                <View style={styles.actionLeft}>
                  <View style={[styles.iconContainer, styles.downloadIcon]}>
                    <Ionicons name="download" size={22} color="#0066CC" />
                  </View>
                  <View style={styles.actionText}>
                    <Text style={styles.actionLabel}>Download My Data</Text>
                    <Text style={styles.actionDescription}>
                      Export all your information
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionItem}
                onPress={handleDataDeletion}
              >
                <View style={styles.actionLeft}>
                  <View style={[styles.iconContainer, styles.deleteIcon]}>
                    <Ionicons name="trash" size={22} color="#D32F2F" />
                  </View>
                  <View style={styles.actionText}>
                    <Text style={[styles.actionLabel, styles.dangerText]}>
                      Delete My Data
                    </Text>
                    <Text style={styles.actionDescription}>
                      Permanently remove all data
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Compliance Info */}
          <View style={styles.complianceCard}>
            <Ionicons name="shield-checkmark-outline" size={32} color="#0066CC" />
            <Text style={styles.complianceTitle}>HIPAA & GDPR Compliant</Text>
            <Text style={styles.complianceText}>
              Your data is protected with bank-level encryption and stored in secure,
              HIPAA-compliant servers. We follow strict GDPR guidelines to protect
              your privacy.
            </Text>
          </View>

          <View style={styles.bottomSpacer} />
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
              {/* Current Password */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Current Password</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color="#8E8E93" />
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
                      name={showCurrentPassword ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color="#8E8E93"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* New Password */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>New Password</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color="#8E8E93" />
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

              {/* Confirm Password */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Confirm New Password</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color="#8E8E93" />
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
                      name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color="#8E8E93"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Password Requirements */}
              <View style={styles.requirementsBox}>
                <Text style={styles.requirementsTitle}>Password Requirements:</Text>
                <Text style={styles.requirementText}>• At least 8 characters</Text>
                <Text style={styles.requirementText}>
                  • Mix of uppercase and lowercase
                </Text>
                <Text style={styles.requirementText}>• At least one number</Text>
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
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F7",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  passwordIcon: { backgroundColor: "#FFF3E0" },
  twoFactorIcon: { backgroundColor: "#E8F5E9" },
  biometricIcon: { backgroundColor: "#E3F2FD" },
  sessionIcon: { backgroundColor: "#F3E5F5" },
  encryptionIcon: { backgroundColor: "#FFEBEE" },
  activityIcon: { backgroundColor: "#E0F7FA" },
  downloadIcon: { backgroundColor: "#E3F2FD" },
  deleteIcon: { backgroundColor: "#FFEBEE" },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: "#8E8E93",
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F7",
  },
  actionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  actionText: {
    flex: 1,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 13,
    color: "#8E8E93",
  },
  dangerText: {
    color: "#D32F2F",
  },
  complianceCard: {
    backgroundColor: "#E3F2FD",
    margin: 16,
    marginTop: 24,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  complianceTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0066CC",
    marginTop: 12,
    marginBottom: 8,
  },
  complianceText: {
    fontSize: 14,
    color: "#636366",
    textAlign: "center",
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 40,
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
    backgroundColor: "#FFFFFF",
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
    borderBottomColor: "#E5E5EA",
  },
  modalTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F5F5F7",
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
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F7",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    gap: 12,
  },
  modalInput: {
    flex: 1,
    fontSize: 16,
    color: "#1C1C1E",
  },
  requirementsBox: {
    backgroundColor: "#F5F5F7",
    borderRadius: 12,
    padding: 16,
    marginTop: 4,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 13,
    color: "#636366",
    marginBottom: 4,
  },
  modalActions: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#F5F5F7",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#8E8E93",
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#0066CC",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});