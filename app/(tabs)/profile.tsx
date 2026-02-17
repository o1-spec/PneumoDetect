import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Edit Profile State
  const [userName, setUserName] = useState("Dr. Sarah Johnson");
  const [userEmail, setUserEmail] = useState("sarah.johnson@hospital.com");
  const [userPhone, setUserPhone] = useState("+1 (555) 123-4567");
  const [userSpecialization, setUserSpecialization] = useState("Radiology");

  // Notifications State
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [scanAlerts, setScanAlerts] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);

  // Language State
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const languages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Chinese",
    "Arabic",
  ];

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => router.replace("/(auth)/login"),
      },
    ]);
  };

  const handleSaveProfile = () => {
    setShowEditModal(false);
    Alert.alert("Success", "Profile updated successfully!");
  };

  const handleSaveNotifications = () => {
    setShowNotificationsModal(false);
    Alert.alert("Success", "Notification preferences saved!");
  };

  const handleDownloadReports = () => {
    Alert.alert("Download Reports", "Download all your medical reports?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Download",
        onPress: () =>
          Alert.alert("Success", "Reports will be downloaded shortly"),
      },
    ]);
  };

  const handlePrivacySecurity = () => {
    Alert.alert("Privacy & Security", "Choose an option:", [
      {
        text: "Change Password",
        onPress: () =>
          Alert.alert(
            "Change Password",
            "Password reset link sent to your email",
          ),
      },
      {
        text: "Two-Factor Authentication",
        onPress: () => Alert.alert("2FA", "Two-factor authentication enabled"),
      },
      {
        text: "Privacy Settings",
        onPress: () =>
          Alert.alert("Privacy", "Your data is encrypted and secure"),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleHelpCenter = () => {
    Alert.alert("Help Center", "What do you need help with?", [
      {
        text: "Getting Started",
        onPress: () => Alert.alert("Tutorial", "View getting started guide"),
      },
      {
        text: "User Guide",
        onPress: () => Alert.alert("Guide", "Download user manual"),
      },
      {
        text: "FAQ",
        onPress: () => Alert.alert("FAQ", "View frequently asked questions"),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top Spacer */}
        <View style={styles.topSpacer} />

        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={60} color="#0066CC" />
          </View>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userEmail}>{userEmail}</Text>
          <View style={styles.roleBadge}>
            <Ionicons name="shield-checkmark" size={14} color="#0066CC" />
            <Text style={styles.roleText}>Admin</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>156</Text>
            <Text style={styles.statLabel}>Total Scans</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>94.5%</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>This Month</Text>
          </View>
        </View>

        {/* Menu Sections */}
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
              badge="3"
              onPress={() => setShowNotificationsModal(true)}
            />
            <MenuItem
              icon="lock-closed-outline"
              label="Privacy & Security"
              onPress={handlePrivacySecurity}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.menuCard}>
            <View style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <Ionicons name="moon-outline" size={22} color="#0066CC" />
                <Text style={styles.menuLabel}>Dark Mode</Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: "#E5E5EA", true: "#0066CC" }}
                thumbColor="#FFFFFF"
              />
            </View>
            <MenuItem
              icon="language-outline"
              label="Language"
              value={selectedLanguage}
              onPress={() => setShowLanguageModal(true)}
            />
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
              onPress={handleHelpCenter}
            />
            <MenuItem
              icon="mail-outline"
              label="Contact Support"
              onPress={() =>
                Alert.alert(
                  "Contact Support",
                  "Email: support@pneumoscan.ai\nPhone: +1 (800) 555-0100",
                )
              }
            />
            <MenuItem
              icon="information-circle-outline"
              label="About"
              onPress={() =>
                Alert.alert(
                  "PneumoScan AI",
                  "Version 1.0.0\n\nAI-Powered Pneumonia Detection\n© 2024 All Rights Reserved",
                )
              }
            />
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#D32F2F" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Edit Profile Modal */}
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
                <Ionicons name="person-outline" size={24} color="#0066CC" />
                <Text style={styles.modalTitle}>Edit Profile</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowEditModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#8E8E93" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Full Name</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="person-outline" size={20} color="#8E8E93" />
                  <TextInput
                    style={styles.modalInput}
                    value={userName}
                    onChangeText={setUserName}
                    placeholder="Enter your name"
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Email Address</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="mail-outline" size={20} color="#8E8E93" />
                  <TextInput
                    style={styles.modalInput}
                    value={userEmail}
                    onChangeText={setUserEmail}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Phone Number</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="call-outline" size={20} color="#8E8E93" />
                  <TextInput
                    style={styles.modalInput}
                    value={userPhone}
                    onChangeText={setUserPhone}
                    placeholder="Enter phone number"
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Specialization</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="medical-outline" size={20} color="#8E8E93" />
                  <TextInput
                    style={styles.modalInput}
                    value={userSpecialization}
                    onChangeText={setUserSpecialization}
                    placeholder="Enter specialization"
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
                <Text style={styles.submitButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Notifications Modal */}
      <Modal
        visible={showNotificationsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNotificationsModal(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowNotificationsModal(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color="#0066CC"
                />
                <Text style={styles.modalTitle}>Notifications</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowNotificationsModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#8E8E93" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Ionicons name="mail-outline" size={22} color="#0066CC" />
                  <View style={styles.settingText}>
                    <Text style={styles.settingLabel}>Email Notifications</Text>
                    <Text style={styles.settingDescription}>
                      Receive updates via email
                    </Text>
                  </View>
                </View>
                <Switch
                  value={emailNotifications}
                  onValueChange={setEmailNotifications}
                  trackColor={{ false: "#E5E5EA", true: "#0066CC" }}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Ionicons
                    name="phone-portrait-outline"
                    size={22}
                    color="#0066CC"
                  />
                  <View style={styles.settingText}>
                    <Text style={styles.settingLabel}>Push Notifications</Text>
                    <Text style={styles.settingDescription}>
                      Get alerts on your device
                    </Text>
                  </View>
                </View>
                <Switch
                  value={pushNotifications}
                  onValueChange={setPushNotifications}
                  trackColor={{ false: "#E5E5EA", true: "#0066CC" }}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Ionicons
                    name="alert-circle-outline"
                    size={22}
                    color="#0066CC"
                  />
                  <View style={styles.settingText}>
                    <Text style={styles.settingLabel}>Scan Alerts</Text>
                    <Text style={styles.settingDescription}>
                      Urgent scan notifications
                    </Text>
                  </View>
                </View>
                <Switch
                  value={scanAlerts}
                  onValueChange={setScanAlerts}
                  trackColor={{ false: "#E5E5EA", true: "#0066CC" }}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Ionicons
                    name="stats-chart-outline"
                    size={22}
                    color="#0066CC"
                  />
                  <View style={styles.settingText}>
                    <Text style={styles.settingLabel}>Weekly Reports</Text>
                    <Text style={styles.settingDescription}>
                      Summary of your activity
                    </Text>
                  </View>
                </View>
                <Switch
                  value={weeklyReports}
                  onValueChange={setWeeklyReports}
                  trackColor={{ false: "#E5E5EA", true: "#0066CC" }}
                />
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowNotificationsModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSaveNotifications}
              >
                <Text style={styles.submitButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Language Modal */}
      <Modal
        visible={showLanguageModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowLanguageModal(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <Ionicons name="language-outline" size={24} color="#0066CC" />
                <Text style={styles.modalTitle}>Select Language</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowLanguageModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#8E8E93" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              {languages.map((language) => (
                <TouchableOpacity
                  key={language}
                  style={styles.languageOption}
                  onPress={() => {
                    setSelectedLanguage(language);
                    setShowLanguageModal(false);
                    Alert.alert(
                      "Language Changed",
                      `Language set to ${language}`,
                    );
                  }}
                >
                  <Text style={styles.languageText}>{language}</Text>
                  {selectedLanguage === language && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color="#0066CC"
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const MenuItem = ({
  icon,
  label,
  value,
  badge,
  onPress,
}: {
  icon: any;
  label: string;
  value?: string;
  badge?: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuLeft}>
      <Ionicons name={icon} size={22} color="#0066CC" />
      <Text style={styles.menuLabel}>{label}</Text>
    </View>
    <View style={styles.menuRight}>
      {badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
      {value && <Text style={styles.menuValue}>{value}</Text>}
      <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F7",
  },
  topSpacer: {
    height: 60,
  },
  profileHeader: {
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingVertical: 32,
    marginBottom: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 12,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  roleText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0066CC",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#E5E5EA",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#8E8E93",
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8E8E93",
    marginBottom: 12,
    marginLeft: 4,
  },
  menuCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F7",
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuLabel: {
    fontSize: 16,
    color: "#1C1C1E",
  },
  menuRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  badge: {
    backgroundColor: "#D32F2F",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "bold",
  },
  menuValue: {
    fontSize: 14,
    color: "#8E8E93",
  },
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 2,
    borderColor: "#D32F2F",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#D32F2F",
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
    maxHeight: "80%",
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
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F7",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
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
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F7",
  },
  languageText: {
    fontSize: 16,
    color: "#1C1C1E",
  },
});
