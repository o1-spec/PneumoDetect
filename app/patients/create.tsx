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
} from "react-native";
import { useToast } from "../../hooks/useToast";
import { patientsAPI } from "../../services/api.client";
import { CreatePatientRequest } from "../../types/api";
import { getErrorMessage } from "../../utils/errorHandler";

export default function CreatePatientScreen() {
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
    if (!validateForm()) {
      return;
    }

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
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#0066CC" />
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
        <View style={styles.infoCard}>
          <Ionicons name="person-add" size={24} color="#0066CC" />
          <Text style={styles.infoText}>Add a new patient to the system</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Patient ID <Text style={styles.required}>*</Text>
            </Text>
            <View
              style={[
                styles.inputContainer,
                errors.idNumber && styles.inputError,
              ]}
            >
              <Ionicons
                name="finger-print"
                size={20}
                color="#8E8E93"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="e.g., PT-12345"
                placeholderTextColor="#C7C7CC"
                value={formData.idNumber}
                onChangeText={(text) =>
                  setFormData({ ...formData, idNumber: text })
                }
                autoCapitalize="characters"
              />
            </View>
            {errors.idNumber && (
              <Text style={styles.errorText}>{errors.idNumber}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Full Name <Text style={styles.required}>*</Text>
            </Text>
            <View
              style={[styles.inputContainer, errors.name && styles.inputError]}
            >
              <Ionicons
                name="person"
                size={20}
                color="#8E8E93"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="e.g., John Doe"
                placeholderTextColor="#C7C7CC"
                value={formData.name}
                onChangeText={(text) =>
                  setFormData({ ...formData, name: text })
                }
                autoCapitalize="words"
              />
            </View>
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.row}>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>
                Age <Text style={styles.required}>*</Text>
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  { flex: 1 },
                  errors.age && styles.inputError,
                ]}
              >
                <Ionicons
                  name="calendar"
                  size={20}
                  color="#8E8E93"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Age"
                  placeholderTextColor="#C7C7CC"
                  value={formData.age.toString()}
                  onChangeText={(text) =>
                    setFormData({ ...formData, age: parseInt(text) || 0 })
                  }
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
                  style={[
                    styles.genderButton,
                    formData.gender === "MALE" && styles.genderButtonActive,
                  ]}
                  onPress={() => setFormData({ ...formData, gender: "MALE" })}
                >
                  <Ionicons
                    name="male"
                    size={20}
                    color={formData.gender === "MALE" ? "#FFFFFF" : "#0066CC"}
                  />
                  <Text
                    style={[
                      styles.genderButtonText,
                      formData.gender === "MALE" &&
                        styles.genderButtonTextActive,
                    ]}
                  >
                    Male
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    formData.gender === "FEMALE" && styles.genderButtonActive,
                  ]}
                  onPress={() => setFormData({ ...formData, gender: "FEMALE" })}
                >
                  <Ionicons
                    name="female"
                    size={20}
                    color={formData.gender === "FEMALE" ? "#FFFFFF" : "#0066CC"}
                  />
                  <Text
                    style={[
                      styles.genderButtonText,
                      formData.gender === "FEMALE" &&
                        styles.genderButtonTextActive,
                    ]}
                  >
                    Female
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.createButton, loading && styles.createButtonDisabled]}
          onPress={handleCreate}
          disabled={loading}
        >
          {loading ? (
            <Text style={styles.createButtonText}>Creating...</Text>
          ) : (
            <>
              <Ionicons name="person-add" size={20} color="#FFFFFF" />
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
    backgroundColor: "#F5F5F7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#0066CC",
    fontWeight: "500",
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
    fontWeight: "600",
    color: "#1C1C1E",
  },
  required: {
    color: "#D32F2F",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    gap: 12,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  inputError: {
    borderColor: "#D32F2F",
  },
  inputIcon: {
    marginRight: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1C1C1E",
  },
  errorText: {
    fontSize: 12,
    color: "#D32F2F",
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    gap: 0,
  },
  genderButtons: {
    flexDirection: "row",
    gap: 8,
  },
  genderButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  genderButtonActive: {
    backgroundColor: "#0066CC",
    borderColor: "#0066CC",
  },
  genderButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0066CC",
  },
  genderButtonTextActive: {
    color: "#FFFFFF",
  },
  createButton: {
    flexDirection: "row",
    backgroundColor: "#0066CC",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 24,
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
