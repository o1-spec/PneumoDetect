import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useToast } from "../../hooks/useToast";
import { patientsAPI } from "../../services/api.client";
import { CreatePatientRequest } from "../../types/api";
import { getErrorMessage } from "../../utils/errorHandler";
import { COLORS, BORDER_RADIUS, SHADOWS, SPACING } from "../../constants/Theme";

export default function CreatePatientScreen() {
  const insets = useSafeAreaInsets();
  const { success, error: showError } = useToast();
  const [formData, setFormData] = useState<CreatePatientRequest>({
    idNumber: "",
    name: "",
    age: 0,
    gender: "MALE",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.idNumber.trim()) {
      newErrors.idNumber = "Patient ID is required";
    }
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.age || formData.age < 0 || formData.age > 150) {
      newErrors.age = "Please enter a valid age";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;
    try {
      setLoading(true);
      await patientsAPI.create(formData);
      success("Patient created successfully!");
      router.back();
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top + 8 : 16 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Patient</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Info banner */}
        <View style={styles.infoCard}>
          <Ionicons name="person-add-outline" size={22} color={COLORS.primary} />
          <Text style={styles.infoText}>Add a new patient record to the clinical system</Text>
        </View>

        <View style={styles.form}>
          {/* Patient ID */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Patient ID <Text style={styles.required}>*</Text>
            </Text>
            <View style={[styles.inputContainer, errors.idNumber && styles.inputError]}>
              <Ionicons name="finger-print" size={20} color={COLORS.textTertiary} />
              <TextInput
                style={styles.input}
                placeholder="e.g., PT-12345"
                placeholderTextColor={COLORS.textTertiary}
                value={formData.idNumber}
                onChangeText={(text) => setFormData({ ...formData, idNumber: text })}
                autoCapitalize="characters"
              />
            </View>
            {errors.idNumber && <Text style={styles.errorText}>{errors.idNumber}</Text>}
          </View>

          {/* Full Name */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Full Name <Text style={styles.required}>*</Text>
            </Text>
            <View style={[styles.inputContainer, errors.name && styles.inputError]}>
              <Ionicons name="person-outline" size={20} color={COLORS.textTertiary} />
              <TextInput
                style={styles.input}
                placeholder="e.g., John Doe"
                placeholderTextColor={COLORS.textTertiary}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                autoCapitalize="words"
              />
            </View>
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          {/* Age + Gender Row */}
          <View style={styles.row}>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>
                Age <Text style={styles.required}>*</Text>
              </Text>
              <View style={[styles.inputContainer, errors.age && styles.inputError]}>
                <Ionicons name="calendar-outline" size={20} color={COLORS.textTertiary} />
                <TextInput
                  style={styles.input}
                  placeholder="Age"
                  placeholderTextColor={COLORS.textTertiary}
                  value={formData.age.toString()}
                  onChangeText={(text) => setFormData({ ...formData, age: parseInt(text) || 0 })}
                  keyboardType="number-pad"
                  maxLength={3}
                />
              </View>
              {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}
            </View>

            <View style={[styles.formGroup, { flex: 1, marginLeft: 12 }]}>
              <Text style={styles.label}>Gender</Text>
              <View style={styles.genderButtons}>
                <TouchableOpacity
                  style={[styles.genderButton, formData.gender === "MALE" && styles.genderButtonActive]}
                  onPress={() => setFormData({ ...formData, gender: "MALE" })}
                >
                  <Ionicons name="male" size={18} color={formData.gender === "MALE" ? "#FFFFFF" : COLORS.primary} />
                  <Text style={[styles.genderButtonText, formData.gender === "MALE" && styles.genderButtonTextActive]}>
                    Male
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.genderButton, formData.gender === "FEMALE" && styles.genderButtonActive]}
                  onPress={() => setFormData({ ...formData, gender: "FEMALE" })}
                >
                  <Ionicons name="female" size={18} color={formData.gender === "FEMALE" ? "#FFFFFF" : COLORS.primary} />
                  <Text style={[styles.genderButtonText, formData.gender === "FEMALE" && styles.genderButtonTextActive]}>
                    Female
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.createButton, loading && styles.createButtonDisabled]}
          onPress={handleCreate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              <Ionicons name="person-add-outline" size={20} color="#FFFFFF" />
              <Text style={styles.createButtonText}>Create Patient</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.md,
    paddingBottom: 16,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...SHADOWS.light,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 20,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primaryLight,
    padding: 14,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: 24,
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
  },
  form: {
    gap: 20,
    marginBottom: 24,
  },
  formGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  required: {
    color: COLORS.danger,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: 14,
    height: 52,
    gap: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputError: {
    borderColor: COLORS.danger,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: "500",
  },
  errorText: {
    fontSize: 12,
    color: COLORS.danger,
    marginTop: 4,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
  },
  genderButtons: {
    flexDirection: "row",
    gap: 8,
    flex: 1,
  },
  genderButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    height: 52,
  },
  genderButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  genderButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },
  genderButtonTextActive: {
    color: "#FFFFFF",
  },
  createButton: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: BORDER_RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 24,
    ...SHADOWS.light,
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
