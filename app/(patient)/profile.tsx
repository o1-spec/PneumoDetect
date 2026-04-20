import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useContext, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { AuthContext } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { usersAPI } from "../../services/api.client";
import { getErrorMessage } from "../../utils/errorHandler";

export default function PatientProfileScreen() {
  const authContext = useContext(AuthContext);
  const { success, error: showError } = useToast();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!authContext) {
    return <Text>Auth context not available</Text>;
  }

  const { user, logout, updateProfile } = authContext;

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    dateOfBirth: user?.dateOfBirth || "",
    gender: user?.gender || "MALE",
    medicalHistory: user?.medicalHistory || "",
  });

  const handleSave = async () => {
    try {
      setLoading(true);
      // Use patient-specific endpoint to update profile
      await usersAPI.updatePatientProfile({
        name: formData.name,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        medicalHistory: formData.medicalHistory,
      });
      success("Profile updated successfully!");
      setEditMode(false);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
            router.replace("/(auth)/login");
          } catch (error) {
            showError("Logout failed");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Profile</Text>
        {!editMode && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditMode(true)}
          >
            <Ionicons name="pencil" size={20} color="#0066CC" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={80} color="#0066CC" />
          </View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userRole}>Patient</Text>
        </View>

        {/* Personal Information Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person-outline" size={20} color="#0066CC" />
            <Text style={styles.sectionTitle}>Personal Information</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={[styles.input, !editMode && styles.inputDisabled]}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              editable={editMode}
              placeholderTextColor="#D0D0D0"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value={formData.email}
              editable={false}
              placeholderTextColor="#D0D0D0"
            />
            <Text style={styles.helperText}>Email cannot be changed</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={[styles.input, !editMode && styles.inputDisabled]}
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              editable={editMode}
              placeholder="(Optional)"
              placeholderTextColor="#D0D0D0"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Health Information Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="fitness-outline" size={20} color="#4CAF50" />
            <Text style={[styles.sectionTitle, { color: "#4CAF50" }]}>
              Health Information
            </Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Date of Birth</Text>
            <TextInput
              style={[styles.input, !editMode && styles.inputDisabled]}
              value={formData.dateOfBirth}
              onChangeText={(text) =>
                setFormData({ ...formData, dateOfBirth: text })
              }
              editable={editMode}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#D0D0D0"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderButtons}>
              {(["MALE", "FEMALE", "OTHER"] as const).map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[
                    styles.genderButton,
                    !editMode && styles.genderButtonDisabled,
                    formData.gender === g && styles.genderButtonSelected,
                  ]}
                  onPress={() => {
                    if (editMode) setFormData({ ...formData, gender: g });
                  }}
                >
                  <Text
                    style={[
                      styles.genderButtonText,
                      formData.gender === g && styles.genderButtonTextSelected,
                    ]}
                  >
                    {g}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Medical History (Optional)</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                !editMode && styles.inputDisabled,
              ]}
              value={formData.medicalHistory}
              onChangeText={(text) =>
                setFormData({ ...formData, medicalHistory: text })
              }
              editable={editMode}
              placeholder="Any relevant medical conditions or allergies"
              placeholderTextColor="#D0D0D0"
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="lock-closed-outline" size={20} color="#D32F2F" />
            <Text style={[styles.sectionTitle, { color: "#D32F2F" }]}>
              Account
            </Text>
          </View>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/(auth)/forgot-password")}
          >
            <Ionicons name="key-outline" size={20} color="#0066CC" />
            <Text style={styles.actionButtonText}>Change Password</Text>
            <Ionicons name="chevron-forward" size={20} color="#D0D0D0" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.dangerButton]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color="#D32F2F" />
            <Text style={[styles.actionButtonText, { color: "#D32F2F" }]}>
              Logout
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#D0D0D0" />
          </TouchableOpacity>
        </View>

        {/* Edit Mode Actions */}
        {editMode && (
          <View style={styles.editActions}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.cancelBtn]}
              onPress={() => setEditMode(false)}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.saveBtn]}
              onPress={handleSave}
              disabled={loading}
            >
              <Text style={styles.saveBtnText}>
                {loading ? "Saving..." : "Save Changes"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
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
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  avatarContainer: {
    marginBottom: 12,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: "#8E8E93",
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  formGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#F5F5F7",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#1C1C1E",
  },
  inputDisabled: {
    backgroundColor: "#FFFFFF",
    color: "#8E8E93",
  },
  textArea: {
    paddingTop: 10,
    textAlignVertical: "top",
    height: 100,
  },
  helperText: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 4,
  },
  genderButtons: {
    flexDirection: "row",
    gap: 10,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    backgroundColor: "#F5F5F7",
    alignItems: "center",
  },
  genderButtonDisabled: {
    opacity: 0.6,
  },
  genderButtonSelected: {
    backgroundColor: "#0066CC",
    borderColor: "#0066CC",
  },
  genderButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8E8E93",
  },
  genderButtonTextSelected: {
    color: "#FFFFFF",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: "#F5F5F7",
  },
  dangerButton: {
    backgroundColor: "#FFF3E0",
  },
  actionButtonText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  editActions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelBtn: {
    backgroundColor: "#F5F5F7",
  },
  saveBtn: {
    backgroundColor: "#0066CC",
  },
  cancelBtnText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#8E8E93",
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});
