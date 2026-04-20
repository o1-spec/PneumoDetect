import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import React, { useContext, useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
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
  const [specialization, setSpecialization] = useState(""); // Clinician only
  const [dateOfBirth, setDateOfBirth] = useState(""); // Patient only
  const [gender, setGender] = useState<"MALE" | "FEMALE" | "OTHER">("MALE"); // Patient only
  const [medicalHistory, setMedicalHistory] = useState(""); // Patient only
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSpecializationPicker, setShowSpecializationPicker] =
    useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
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
        ...(role === "PATIENT" && {
          dateOfBirth: dateOfBirth || undefined,
          gender: gender,
          medicalHistory: medicalHistory || undefined,
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
      console.error("Signup error:", error);
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
            router.canGoBack() ? router.back() : router.push("/")
          }
        >
          <Ionicons name="arrow-back" size={24} color="#0066CC" />
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Ionicons name="person-add" size={48} color="#0066CC" />
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join PneumoDetect AI</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.formGroup}>
            <View
              style={[
                styles.inputContainer,
                errors.fullName && styles.inputError,
              ]}
            >
              <Ionicons
                name="person-outline"
                size={20}
                color="#8E8E93"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#8E8E93"
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  if (errors.fullName) setErrors({ ...errors, fullName: "" });
                }}
                autoCapitalize="words"
              />
            </View>
            {errors.fullName && (
              <Text style={styles.errorText}>{errors.fullName}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <View
              style={[styles.inputContainer, errors.email && styles.inputError]}
            >
              <Ionicons
                name="mail-outline"
                size={20}
                color="#8E8E93"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#8E8E93"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          <View style={styles.roleContainer}>
            <Text style={styles.roleLabel}>Account Type</Text>
            <View style={styles.roleButtons}>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  role === "CLINICIAN" && styles.roleButtonActive,
                ]}
                onPress={() => setRole("CLINICIAN")}
              >
                <Ionicons
                  name="medical"
                  size={20}
                  color={role === "CLINICIAN" ? "#FFFFFF" : "#0066CC"}
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
                  name="person-circle"
                  size={20}
                  color={role === "PATIENT" ? "#FFFFFF" : "#0066CC"}
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
          </View>

          {role === "CLINICIAN" && (
            <View style={styles.formGroup}>
              <TouchableOpacity
                style={[styles.inputContainer, styles.specializationButton]}
                onPress={() => setShowSpecializationPicker(true)}
              >
                <Ionicons
                  name="briefcase-outline"
                  size={20}
                  color="#8E8E93"
                  style={styles.inputIcon}
                />
                <Text
                  style={[
                    styles.input,
                    !specialization && styles.placeholderText,
                  ]}
                >
                  {specialization || " Specialization (Optional)"}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={20}
                  color="#8E8E93"
                  style={{ marginRight: 12 }}
                />
              </TouchableOpacity>

              <Modal
                visible={showSpecializationPicker}
                animationType="slide"
                transparent
                onRequestClose={() => setShowSpecializationPicker(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>
                        Select Specialization
                      </Text>
                      <TouchableOpacity
                        onPress={() => setShowSpecializationPicker(false)}
                      >
                        <Ionicons name="close" size={24} color="#0066CC" />
                      </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalList}>
                      <TouchableOpacity
                        style={styles.modalOption}
                        onPress={() => {
                          setSpecialization("");
                          setShowSpecializationPicker(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.modalOptionText,
                            !specialization && styles.modalOptionTextActive,
                          ]}
                        >
                          None (Optional)
                        </Text>
                      </TouchableOpacity>

                      {SPECIALIZATIONS.map((spec) => (
                        <TouchableOpacity
                          key={spec}
                          style={styles.modalOption}
                          onPress={() => {
                            setSpecialization(spec);
                            setShowSpecializationPicker(false);
                          }}
                        >
                          <Text
                            style={[
                              styles.modalOptionText,
                              specialization === spec &&
                                styles.modalOptionTextActive,
                            ]}
                          >
                            {spec}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              </Modal>
            </View>
          )}

          {role === "PATIENT" && (
            <>
              <View style={styles.formGroup}>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color="#8E8E93"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Date of Birth (YYYY-MM-DD) (Optional)"
                    placeholderTextColor="#8E8E93"
                    value={dateOfBirth}
                    onChangeText={setDateOfBirth}
                    keyboardType="default"
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <TouchableOpacity
                  style={styles.inputContainer}
                  onPress={() => setShowGenderPicker(true)}
                >
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color="#8E8E93"
                    style={styles.inputIcon}
                  />
                  <Text style={styles.input}>{gender}</Text>
                  <Ionicons
                    name="chevron-down"
                    size={20}
                    color="#8E8E93"
                    style={{ marginRight: 12 }}
                  />
                </TouchableOpacity>

                <Modal
                  visible={showGenderPicker}
                  animationType="slide"
                  transparent
                  onRequestClose={() => setShowGenderPicker(false)}
                >
                  <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                      <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Select Gender</Text>
                        <TouchableOpacity
                          onPress={() => setShowGenderPicker(false)}
                        >
                          <Ionicons name="close" size={24} color="#0066CC" />
                        </TouchableOpacity>
                      </View>

                      <ScrollView style={styles.modalList}>
                        {(["MALE", "FEMALE", "OTHER"] as const).map((g) => (
                          <TouchableOpacity
                            key={g}
                            style={styles.modalOption}
                            onPress={() => {
                              setGender(g);
                              setShowGenderPicker(false);
                            }}
                          >
                            <Text
                              style={[
                                styles.modalOptionText,
                                gender === g && styles.modalOptionTextActive,
                              ]}
                            >
                              {g}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  </View>
                </Modal>
              </View>

              <View style={styles.formGroup}>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="document-text-outline"
                    size={20}
                    color="#8E8E93"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Medical History (Optional)"
                    placeholderTextColor="#8E8E93"
                    value={medicalHistory}
                    onChangeText={setMedicalHistory}
                    multiline
                    numberOfLines={3}
                  />
                </View>
              </View>
            </>
          )}

          <View style={styles.inputContainer}>
            <Ionicons
              name="call-outline"
              size={20}
              color="#8E8E93"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone (Optional)"
              placeholderTextColor="#8E8E93"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.formGroup}>
            <View
              style={[
                styles.inputContainer,
                errors.password && styles.inputError,
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#8E8E93"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#8E8E93"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors({ ...errors, password: "" });
                }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#8E8E93"
                />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <View
              style={[
                styles.inputContainer,
                errors.confirmPassword && styles.inputError,
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#8E8E93"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#8E8E93"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword)
                    setErrors({ ...errors, confirmPassword: "" });
                }}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#8E8E93"
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.signUpButton,
              (loading || !isFormValid()) && styles.signUpButtonDisabled,
            ]}
            onPress={handleSignUp}
            disabled={loading || !isFormValid()}
          >
            <Text style={styles.signUpButtonText}>
              {loading ? "Creating Account..." : "Create Account"}
            </Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F7",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#8E8E93",
  },
  form: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F7",
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  inputError: {
    borderWidth: 1,
    borderColor: "#D32F2F",
    backgroundColor: "#FFEBEE",
  },
  formGroup: {
    marginBottom: 12,
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 12,
    marginTop: 4,
    marginHorizontal: 4,
    marginBottom: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1C1C1E",
  },
  eyeIcon: {
    padding: 8,
  },
  specializationButton: {
    justifyContent: "space-between",
  },
  placeholderText: {
    color: "#8E8E93",
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
    paddingTop: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F7",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  modalList: {
    maxHeight: "90%",
  },
  modalOption: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F7",
  },
  modalOptionText: {
    fontSize: 16,
    color: "#1C1C1E",
  },
  modalOptionTextActive: {
    color: "#0066CC",
    fontWeight: "600",
  },
  roleContainer: {
    marginBottom: 16,
  },
  roleLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 12,
  },
  roleButtons: {
    flexDirection: "row",
    gap: 12,
  },
  roleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F7",
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  roleButtonActive: {
    backgroundColor: "#0066CC",
    borderColor: "#0066CC",
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0066CC",
  },
  roleButtonTextActive: {
    color: "#FFFFFF",
  },
  signUpButton: {
    backgroundColor: "#0066CC",
    borderRadius: 12,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
    shadowColor: "#0066CC",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  signUpButtonDisabled: {
    opacity: 0.5,
    backgroundColor: "#CCCCCC",
  },
  signUpButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    color: "#8E8E93",
    fontSize: 14,
  },
  loginLink: {
    color: "#0066CC",
    fontSize: 14,
    fontWeight: "600",
  },
  textArea: {
    height: 80,
    paddingTop: 12,
    textAlignVertical: "top",
  },
});
