import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useContext, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthHeader } from "../../components/auth/AuthHeader";
import { AuthInput } from "../../components/auth/AuthInput";
import { PremiumButton } from "../../components/auth/PremiumButton";
import { AuthContext } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { RegisterRequest } from "../../types/api";
import { getErrorMessage } from "../../utils/errorHandler";

const SPECIALIZATIONS = [
  "General Practice",
  "Pulmonology",
  "Radiology",
  "Internal Medicine",
  "Family Medicine",
  "Pediatrics",
  "Emergency Medicine",
  "Critical Care",
  "Infectious Disease",
  "Respiratory Medicine",
];

export default function SignUpScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"CLINICIAN" | "PATIENT">("CLINICIAN");
  const [specialization, setSpecialization] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSpecializationPicker, setShowSpecializationPicker] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { success, error: showError } = useToast();

  const authContext = useContext(AuthContext);
  if (!authContext) {
    return <Text>Auth context not available</Text>;
  }

  const { register } = authContext;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = (): boolean => {
    return (
      fullName.trim() !== "" &&
      email.trim() !== "" &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
      password !== "" &&
      password.length >= 6 &&
      confirmPassword !== "" &&
      password === confirmPassword
    );
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const registerData: RegisterRequest = {
        name: fullName,
        email,
        password,
        role,
        phone: phone || undefined,
        ...(role === "CLINICIAN" && {
          specialization: specialization || undefined,
        }),
      };

      await register(registerData);

      success("Account created successfully!");
      router.push({
        pathname: "/(auth)/otp-verification",
        params: { email },
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            router.canGoBack() ? router.back() : router.push("/(auth)/login")
          }
        >
          <Ionicons name="chevron-back" size={24} color="#0B5ED7" />
        </TouchableOpacity>

        <AuthHeader
          icon="person-add-outline"
          title="Create Account"
          subtitle="Join PneumoDetect AI today"
        />

        <View style={styles.form}>
          <AuthInput
            label="Full Name"
            icon="person-outline"
            placeholder="John Doe"
            autoCapitalize="words"
            value={fullName}
            error={errors.fullName}
            onChangeText={(text: string) => {
              setFullName(text);
              if (errors.fullName) setErrors({ ...errors, fullName: "" });
            }}
          />

          <AuthInput
            label="Email Address"
            icon="mail-outline"
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            error={errors.email}
            onChangeText={(text: string) => {
              setEmail(text);
              if (errors.email) setErrors({ ...errors, email: "" });
            }}
          />

          <AuthInput
            label="Phone Number (Optional)"
            icon="call-outline"
            placeholder="+1 (555) 123-4567"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <Text style={styles.roleLabel}>Account Type</Text>
          <View style={styles.roleButtonsContainer}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                role === "CLINICIAN" && styles.roleButtonActive,
              ]}
              onPress={() => setRole("CLINICIAN")}
            >
              <Ionicons
                name="medical"
                size={24}
                color={role === "CLINICIAN" ? "#0B5ED7" : "#6B7280"}
              />
              <Text
                style={[
                  styles.roleButtonText,
                  role === "CLINICIAN" && styles.roleButtonTextActive,
                ]}
              >
                Clinician
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleButton,
                role === "PATIENT" && styles.roleButtonActive,
              ]}
              onPress={() => setRole("PATIENT")}
            >
              <Ionicons
                name="person-circle-outline"
                size={24}
                color={role === "PATIENT" ? "#0B5ED7" : "#6B7280"}
              />
              <Text
                style={[
                  styles.roleButtonText,
                  role === "PATIENT" && styles.roleButtonTextActive,
                ]}
              >
                Patient
              </Text>
            </TouchableOpacity>
          </View>

          {role === "CLINICIAN" && (
            <TouchableOpacity
              style={styles.selectorButton}
              onPress={() => setShowSpecializationPicker(true)}
            >
              <View style={styles.selectorButtonLeft}>
                <Ionicons name="briefcase-outline" size={18} color="#0B5ED7" />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.selectorButtonLabel}>Specialization</Text>
                  <Text
                    style={[
                      styles.selectorButtonValue,
                      !specialization && styles.selectorButtonPlaceholder,
                    ]}
                  >
                    {specialization || "Choose specialization"}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}

          <AuthInput
            label="Password"
            icon="lock-closed-outline"
            placeholder="••••••••"
            secureTextEntry={!showPassword}
            showPasswordToggle={true}
            isPassword={true}
            value={password}
            error={errors.password}
            onChangeText={(text: string) => {
              setPassword(text);
              if (errors.password) setErrors({ ...errors, password: "" });
            }}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />

          <AuthInput
            label="Confirm Password"
            icon="lock-closed-outline"
            placeholder="••••••••"
            secureTextEntry={!showConfirmPassword}
            showPasswordToggle={true}
            isPassword={true}
            value={confirmPassword}
            error={errors.confirmPassword}
            onChangeText={(text: string) => {
              setConfirmPassword(text);
              if (errors.confirmPassword)
                setErrors({ ...errors, confirmPassword: "" });
            }}
            onTogglePassword={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
          />

          <PremiumButton
            variant="primary"
            size="lg"
            loading={loading}
            disabled={!isFormValid() || loading}
            onPress={handleSignUp}
          >
            Create Account
          </PremiumButton>

          <View style={styles.signinContainer}>
            <Text style={styles.signinText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
              <Text style={styles.signinLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showSpecializationPicker}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => setShowSpecializationPicker(false)}
              >
                <Text style={styles.modalCloseButton}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Specialization</Text>
              <TouchableOpacity
                onPress={() => setShowSpecializationPicker(false)}
              >
                <Text style={styles.modalConfirmButton}>Done</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalOptions}>
              {SPECIALIZATIONS.map((spec) => (
                <TouchableOpacity
                  key={spec}
                  style={[
                    styles.specOption,
                    specialization === spec && styles.specOptionActive,
                  ]}
                  onPress={() => {
                    setSpecialization(spec);
                    setShowSpecializationPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.specOptionText,
                      specialization === spec && styles.specOptionTextActive,
                    ]}
                  >
                    {spec}
                  </Text>
                  {specialization === spec && (
                    <Ionicons name="checkmark" size={20} color="#0B5ED7" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFBFC",
    paddingTop: 50,
    paddingVertical: 20,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },
  backButton: {
    alignSelf: "flex-start",
    padding: 8,
    marginBottom: 16,
  },
  form: {
    marginTop: 20,
    gap: 16,
  },
  roleLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  roleButtonsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 4,
  },
  roleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },
  roleButtonActive: {
    borderColor: "#0B5ED7",
    backgroundColor: "#E0E7FF",
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  roleButtonTextActive: {
    color: "#0B5ED7",
  },
  selectorButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    marginBottom: 4,
  },
  selectorButtonLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  selectorButtonLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  selectorButtonValue: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111827",
    marginTop: 4,
  },
  selectorButtonPlaceholder: {
    color: "#9CA3AF",
  },
  signinContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  signinText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  signinLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0B5ED7",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalCloseButton: {
    fontSize: 15,
    fontWeight: "500",
    color: "#6B7280",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  modalConfirmButton: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0B5ED7",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  modalOptions: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  specOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginVertical: 4,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  specOptionActive: {
    backgroundColor: "#E0E7FF",
  },
  specOptionText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111827",
  },
  specOptionTextActive: {
    color: "#0B5ED7",
    fontWeight: "600",
  },
});
