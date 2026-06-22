import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Switch,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "../../components/premium";
import { AuthContext } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { getErrorMessage } from "../../utils/errorHandler";
import { dialogManager } from "../../utils/dialogManager";
import { COLORS, BORDER_RADIUS, SHADOWS, SPACING } from "../../constants/Theme";

export default function PatientProfileScreen() {
  const insets = useSafeAreaInsets();
  const authContext = useContext(AuthContext);
  const { success, warning, error: showError } = useToast();

  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Toggles for notifications
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);

  if (!authContext) {
    return <Text>Auth context not available</Text>;
  }

  const { user, logout, changePassword } = authContext;

  const handleLogout = () => {
    dialogManager.show({
      title: "Sign Out",
      message: "Are you sure you want to sign out?",
      buttons: [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
              warning("Logged out successfully");
            } catch (error) {
              showError("Sign out failed");
            }
          },
        },
      ],
    });
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      showError("Please fill in all password fields");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError("New passwords do not match");
      return;
    }

    try {
      setIsChangingPassword(true);
      await changePassword(passwordData);
      success("Password successfully updated!");
      setIsPasswordModalVisible(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      const msg = getErrorMessage(error) || "Failed to update password";
      showError(msg);
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top + 8 : 16 }]}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* User Card */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={72} color={COLORS.primary} />
          </View>
          <Text style={styles.userName}>{user?.name || "Patient Account"}</Text>
          <Text style={styles.userEmail}>{user?.email || "patient@pneumodetect.com"}</Text>
        </View>

        {/* 1. Account Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Account</Text>
          <Card elevated="light" style={styles.card}>
            <View style={styles.accountRow}>
              <View style={styles.rowLeft}>
                <Ionicons name="person-outline" size={20} color={COLORS.textSecondary} />
                <Text style={styles.rowLabel}>Full Name</Text>
              </View>
              <Text style={styles.rowValue}>{user?.name || "N/A"}</Text>
            </View>
            <View style={styles.accountRow}>
              <View style={styles.rowLeft}>
                <Ionicons name="mail-outline" size={20} color={COLORS.textSecondary} />
                <Text style={styles.rowLabel}>Email</Text>
              </View>
              <Text style={styles.rowValue}>{user?.email || "N/A"}</Text>
            </View>
            {user?.phone ? (
              <View style={[styles.accountRow, { borderBottomWidth: 0 }]}>
                <View style={styles.rowLeft}>
                  <Ionicons name="call-outline" size={20} color={COLORS.textSecondary} />
                  <Text style={styles.rowLabel}>Phone</Text>
                </View>
                <Text style={styles.rowValue}>{user?.phone}</Text>
              </View>
            ) : null}
          </Card>
        </View>

        {/* 2. Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Notifications</Text>
          <Card elevated="light" style={styles.card}>
            <View style={styles.switchRow}>
              <View style={styles.rowLeft}>
                <Ionicons name="notifications-outline" size={20} color={COLORS.primary} />
                <Text style={styles.rowLabel}>Push Notifications</Text>
              </View>
              <Switch
                value={pushEnabled}
                onValueChange={setPushEnabled}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
              />
            </View>

            <View style={[styles.switchRow, { borderBottomWidth: 0 }]}>
              <View style={styles.rowLeft}>
                <Ionicons name="mail-unread-outline" size={20} color={COLORS.primary} />
                <Text style={styles.rowLabel}>Email Alerts</Text>
              </View>
              <Switch
                value={emailEnabled}
                onValueChange={setEmailEnabled}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
              />
            </View>
          </Card>
        </View>

        {/* 3. Privacy & Security Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Privacy & Security</Text>
          <Card elevated="light" style={styles.card}>
            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => setIsPasswordModalVisible(true)}
            >
              <View style={styles.rowLeft}>
                <Ionicons name="lock-closed-outline" size={20} color={COLORS.danger} />
                <Text style={styles.rowLabel}>Change Password</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={COLORS.textTertiary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionRow, { borderBottomWidth: 0 }]}
              onPress={() => success("Your diagnostic data settings are fully secure.")}
            >
              <View style={styles.rowLeft}>
                <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.success} />
                <Text style={styles.rowLabel}>Diagnostic Privacy</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={COLORS.textTertiary} />
            </TouchableOpacity>
          </Card>
        </View>

        {/* 4. Help Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Help & Support</Text>
          <Card elevated="light" style={styles.card}>
            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => router.push("/profile/help-center")}
            >
              <View style={styles.rowLeft}>
                <Ionicons name="help-circle-outline" size={20} color={COLORS.primary} />
                <Text style={styles.rowLabel}>Help Center & FAQ</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={COLORS.textTertiary} />
            </TouchableOpacity>
          </Card>
        </View>

        {/* 5. Sign Out Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Change Password Modal */}
      <Modal
        visible={isPasswordModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsPasswordModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change Password</Text>
              <TouchableOpacity onPress={() => setIsPasswordModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Current Password</Text>
              <TextInput
                style={styles.input}
                value={passwordData.currentPassword}
                onChangeText={(text) =>
                  setPasswordData({ ...passwordData, currentPassword: text })
                }
                secureTextEntry
                placeholder="Enter current password"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>New Password</Text>
              <TextInput
                style={styles.input}
                value={passwordData.newPassword}
                onChangeText={(text) =>
                  setPasswordData({ ...passwordData, newPassword: text })
                }
                secureTextEntry
                placeholder="Enter new password"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Confirm New Password</Text>
              <TextInput
                style={styles.input}
                value={passwordData.confirmPassword}
                onChangeText={(text) =>
                  setPasswordData({ ...passwordData, confirmPassword: text })
                }
                secureTextEntry
                placeholder="Confirm new password"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <TouchableOpacity
              style={[styles.actionBtn, styles.saveBtn, { marginTop: 10 }]}
              onPress={handleChangePassword}
              disabled={isChangingPassword}
            >
              {isChangingPassword ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.saveBtnText}>Update Password</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...SHADOWS.light,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 24,
  },
  avatarContainer: {
    marginBottom: 8,
  },
  userName: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "500",
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 10,
    marginLeft: 4,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  accountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  rowValue: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.textSecondary,
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: COLORS.dangerLight,
    paddingVertical: 16,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.dangerLight,
  },
  signOutButtonText: {
    color: COLORS.danger,
    fontSize: 16,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 24,
    width: "100%",
    ...SHADOWS.heavy,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  actionBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
