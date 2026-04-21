import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useContext, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MenuItem } from "../../components/MenuItem";
import { StatCard } from "../../components/premium";
import { AuthContext } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { analyticsAPI, notificationsAPI } from "../../services/api.client";
import { AnalyticsStats } from "../../types/api";
import { getErrorMessage } from "../../utils/errorHandler";
import { dialogManager } from "../../utils/dialogManager";

export default function ProfileScreen() {
  const authContext = useContext(AuthContext);
  const { success, error: showError, warning } = useToast();
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [notificationCount, setNotificationCount] = useState(0);

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userSpecialization, setUserSpecialization] = useState("");

  useFocusEffect(
    useCallback(() => {
      if (authContext?.user) {
        setUserName(authContext.user.name || "");
        setUserEmail(authContext.user.email || "");
        setUserPhone(authContext.user.phone || "");
        setUserSpecialization(authContext.user.specialization || "");
      }
      loadStats();
      loadNotificationCount();
    }, [authContext?.user]),
  );

  const loadStats = async () => {
    try {
      const data = await analyticsAPI.getStats();
      setStats(data);
    } catch (err) {
      // Silent fail for stats
    }
  };

  const loadNotificationCount = async () => {
    try {
      const notifications = await notificationsAPI.getAll();
      const unreadCount = notifications.filter((n) => !n.read).length;
      setNotificationCount(unreadCount);
    } catch (err) {
      // Silent fail - keep count as 0
      setNotificationCount(0);
    }
  };

  const handleLogout = () => {
    dialogManager.show({
      title: "Logout",
      message: "Are you sure you want to logout from PneumoDetect?",
      buttons: [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await authContext?.logout();
              warning("Logged out successfully");
              router.replace("/(auth)/login");
            } catch (err) {
              showError(getErrorMessage(err));
            }
          },
        },
      ],
    });
  };

  const handleClearSession = () => {
    dialogManager.show({
      title: "Clear Session",
      message: "This will delete all stored data (token, user info, onboarding flag) for fresh testing. You'll be logged out.",
      buttons: [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear All Data",
          style: "destructive",
          onPress: async () => {
            try {
              await authContext?.clearSession();
              success("Session cleared! Starting fresh...");
              router.replace("/(auth)/login");
            } catch (err) {
              showError(getErrorMessage(err));
            }
          },
        },
      ],
    });
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      await authContext?.updateProfile({
        name: userName,
        phone: userPhone,
        specialization: userSpecialization,
      });
      setShowEditModal(false);
      success("Profile updated successfully!");
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReports = () => {
    dialogManager.show({
      title: "Download Reports",
      message: "Download all your medical reports?",
      buttons: [
        { text: "Cancel", style: "cancel" },
        {
          text: "Download",
          onPress: () =>
            success("Reports will be downloaded shortly"),
        },
      ]
    });
  };

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.topSpacer} />

        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={60} color="#FFFFFF" />
          </View>
          <Text style={styles.userName}>
            {authContext?.user?.name || "User"}
          </Text>
          <Text style={styles.userEmail}>{authContext?.user?.email || ""}</Text>
          {authContext?.user?.role && (
            <View style={styles.roleBadge}>
              <Ionicons name="shield-checkmark" size={14} color="#FFFFFF" />
              <Text style={styles.roleText}>
                {authContext.user.role === "CLINICIAN"
                  ? "Clinician"
                  : "Patient"}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.statsGrid}>
            <StatCard
              icon="document-text-outline"
              title="Total Scans"
              value={stats?.totalScans || 0}
              color="#0B5ED7"
              backgroundColor="rgba(11, 94, 215, 0.08)"
            />
            <StatCard
              icon="checkmark-circle-outline"
              title="Completed"
              value={stats?.completedScans || 0}
              color="#10B981"
              backgroundColor="rgba(16, 185, 129, 0.08)"
            />
          </View>
          <View style={styles.statsGrid}>
            <StatCard
              icon="analytics-outline"
              title="Avg Confidence"
              value={`${Math.round(stats?.averageConfidence || 0)}%`}
              color="#F59E0B"
              backgroundColor="rgba(245, 158, 11, 0.08)"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon="person-outline"
              label="Edit Profile"
              onPress={() => setShowEditModal(true)}
            />
            <MenuItem
              icon="notifications-outline"
              label="Notifications"
              badge={
                notificationCount > 0 ? String(notificationCount) : undefined
              }
              onPress={() => router.push("/profile/notifications")}
            />
            <MenuItem
              icon="lock-closed-outline"
              label="Privacy & Security"
              onPress={() => router.push("/profile/privacy-security")}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon="download-outline"
              label="Download Reports"
              onPress={handleDownloadReports}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon="help-circle-outline"
              label="Help Center"
              onPress={() => router.push("/profile/help-center")}
            />
            <MenuItem
              icon="mail-outline"
              label="Contact Support"
              onPress={() => router.push("/profile/contact")}
            />
            <MenuItem
              icon="information-circle-outline"
              label="About"
              onPress={() => router.push("/profile/about")}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#D32F2F" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={styles.clearSessionButton}
          onPress={handleClearSession}
        >
          <Ionicons name="trash-bin-outline" size={20} color="#FF9800" />
          <Text style={styles.clearSessionText}>Clear Session (Testing)</Text>
        </TouchableOpacity> */}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowEditModal(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <View style={styles.modalIconContainer}>
                  <Ionicons
                    name="person-circle-outline"
                    size={28}
                    color="#0B5ED7"
                  />
                </View>
                <View>
                  <Text style={styles.modalTitle}>Edit Profile</Text>
                  <Text style={styles.modalSubtitle}>
                    Update your information
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setShowEditModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Full Name</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="person-outline" size={18} color="#9CA3AF" />
                  <TextInput
                    style={styles.modalInput}
                    value={userName}
                    onChangeText={setUserName}
                    placeholder="Enter your full name"
                    placeholderTextColor="#D1D5DB"
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Email Address</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="mail-outline" size={18} color="#9CA3AF" />
                  <TextInput
                    style={styles.modalInput}
                    value={userEmail}
                    onChangeText={setUserEmail}
                    placeholder="your@email.com"
                    placeholderTextColor="#D1D5DB"
                    keyboardType="email-address"
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Phone Number</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="call-outline" size={18} color="#9CA3AF" />
                  <TextInput
                    style={styles.modalInput}
                    value={userPhone}
                    onChangeText={setUserPhone}
                    placeholder="+1 (555) 000-0000"
                    placeholderTextColor="#D1D5DB"
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Specialization</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="medical-outline" size={18} color="#9CA3AF" />
                  <TextInput
                    style={styles.modalInput}
                    value={userSpecialization}
                    onChangeText={setUserSpecialization}
                    placeholder="e.g., Pulmonology, Radiology"
                    placeholderTextColor="#D1D5DB"
                  />
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSaveProfile}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={18}
                  color="#FFFFFF"
                />
                <Text style={styles.submitButtonText}>Save Changes</Text>
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
    backgroundColor: "#FAFBFC",
  },
  topSpacer: {
    height: 60,
  },
  profileHeader: {
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingVertical: 36,
    marginBottom: 32,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#0B5ED7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#0B5ED7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  userEmail: {
    fontSize: 15,
    color: "#6B7280",
    marginBottom: 16,
    fontWeight: "500",
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(11, 94, 215, 0.1)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  roleText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#0B5ED7",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  statsGrid: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 16,
    letterSpacing: -0.3,
    textTransform: "uppercase",
  },
  menuCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 14,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 2,
    borderColor: "#EF4444",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#EF4444",
    letterSpacing: -0.3,
  },
  clearSessionButton: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 2,
    borderColor: "#F59E0B",
  },
  clearSessionText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#F59E0B",
  },
  bottomSpacer: {
    height: 60,
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
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#FAFBFC",
  },
  modalTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  modalIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.3,
  },
  modalSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
    marginTop: 2,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
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
    color: "#111827",
    marginBottom: 10,
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    gap: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  modalInput: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
    fontWeight: "500",
  },
  modalActions: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#6B7280",
    letterSpacing: 0.3,
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#0B5ED7",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
});
