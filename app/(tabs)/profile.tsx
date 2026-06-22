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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MenuItem } from "../../components/MenuItem";
import { AuthContext } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { analyticsAPI, scansAPI } from "../../services/api.client";
import { AnalyticsStats } from "../../types/api";
import { getErrorMessage } from "../../utils/errorHandler";
import { dialogManager } from "../../utils/dialogManager";
import { COLORS, BORDER_RADIUS, SHADOWS, SPACING } from "../../constants/Theme";

export default function ProfileScreen() {
  const authContext = useContext(AuthContext);
  const { success, error: showError, warning } = useToast();
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [lastActivity, setLastActivity] = useState<string>("No activity yet");
  const insets = useSafeAreaInsets();

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
        loadStats();
        loadLastActivity();
      }
    }, [authContext?.user]),
  );

  const loadStats = async () => {
    try {
      const data = await analyticsAPI.getStats();
      setStats(data);
    } catch (err) {
      setStats(null);
    }
  };

  const loadLastActivity = async () => {
    try {
      const scans = await scansAPI.getAll();
      if (scans && scans.length > 0) {
        const sorted = [...scans].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        const latest = sorted[0];
        const date = new Date(latest.createdAt);
        const today = new Date();
        
        if (date.toDateString() === today.toDateString()) {
          setLastActivity("Today");
        } else {
          setLastActivity(date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
          }));
        }
      } else {
        setLastActivity("No activity yet");
      }
    } catch (error) {
      setLastActivity("No activity yet");
    }
  };

  const handleLogout = () => {
    dialogManager.show({
      title: "Logout",
      message: "Are you sure you want to sign out from PneumoDetect?",
      buttons: [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            try {
              await authContext?.logout();
              warning("Signed out successfully");
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

  const displaySpecialization = authContext?.user?.specialization || "Internal Medicine";

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Card Header */}
        <View style={[styles.profileHeader, { paddingTop: insets.top > 0 ? insets.top + 16 : 32 }]}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-outline" size={44} color="#FFFFFF" />
          </View>
          <Text style={styles.userName}>
            {authContext?.user?.name || "Dr. Oluwafemi"}
          </Text>
          <Text style={styles.userEmail}>
            {displaySpecialization}
          </Text>
          {authContext?.user?.email ? (
            <Text style={styles.userEmailSub}>{authContext.user.email}</Text>
          ) : null}
        </View>

        {/* Clinical Activity Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Clinical Activity Summary</Text>
          <View style={styles.activitySummaryCard}>
            <View style={styles.activityRow}>
              <Text style={styles.activityLabel}>Cases Reviewed</Text>
              <Text style={styles.activityValue}>{stats?.completedScans || 0}</Text>
            </View>
            <View style={styles.activityDivider} />
            <View style={styles.activityRow}>
              <Text style={styles.activityLabel}>Scans Analyzed</Text>
              <Text style={styles.activityValue}>{stats?.totalScans || 0}</Text>
            </View>
            <View style={styles.activityDivider} />
            <View style={styles.activityRow}>
              <Text style={styles.activityLabel}>Last Activity</Text>
              <Text style={styles.activityValueText}>{lastActivity}</Text>
            </View>
          </View>
        </View>

        {/* Settings Menu List */}
        <View style={styles.section}>
          <View style={styles.menuCard}>
            <MenuItem
              icon="person-outline"
              label="Account"
              onPress={() => setShowEditModal(true)}
            />
            <MenuItem
              icon="lock-closed-outline"
              label="Security"
              onPress={() => router.push("/profile/privacy-security")}
            />
            <MenuItem
              icon="help-circle-outline"
              label="Support"
              onPress={() => router.push("/profile/help-center")}
            />
            <MenuItem
              icon="information-circle-outline"
              label="About"
              onPress={() => router.push("/profile/about")}
            />
          </View>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#D32F2F" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Account Edit Profile Modal */}
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
                    color={COLORS.primary}
                  />
                </View>
                <View>
                  <Text style={styles.modalTitle}>Edit Account Info</Text>
                  <Text style={styles.modalSubtitle}>
                    Update clinician credentials
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
                    editable={false} // Email cannot be changed (primary key/auth identification)
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
                    onChangeText={setUserPhone} // Keep input state connected
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
    backgroundColor: COLORS.background,
  },
  profileHeader: {
    backgroundColor: COLORS.card,
    alignItems: "center",
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...SHADOWS.light,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    ...SHADOWS.light,
  },
  userName: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "600",
    marginTop: 4,
  },
  userEmailSub: {
    fontSize: 12,
    color: COLORS.textTertiary,
    fontWeight: "500",
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.textSecondary,
    marginBottom: 10,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  activitySummaryCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    ...SHADOWS.light,
  },
  activityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  activityDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },
  activityLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  activityValue: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: "800",
  },
  activityValueText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: "700",
  },
  menuCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  logoutButton: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    marginHorizontal: 20,
    marginTop: 28,
    borderRadius: BORDER_RADIUS.md,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1.5,
    borderColor: "#EF4444",
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#EF4444",
    letterSpacing: -0.3,
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
    backgroundColor: COLORS.card,
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
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background,
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
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  modalSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "500",
    marginTop: 2,
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
    paddingHorizontal: 14,
    height: 50,
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  modalActions: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
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
  },
  submitButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});
