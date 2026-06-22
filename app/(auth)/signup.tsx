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
import { COLORS, SHADOWS, BORDER_RADIUS } from "../../constants/Theme";

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
  const [subRole, setSubRole] = useState<"Doctor" | "Radiologist" | "Nurse" | "Researcher" | "Patient">("Doctor");
  const [specialization, setSpecialization] = useState("General Practice");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState<"MALE" | "FEMALE" | "OTHER">("MALE");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSpecializationPicker, setShowSpecializationPicker] =
    useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { success, error: showError } = useToast();

  const handleSubRoleSelect = (selectedSub: "Doctor" | "Radiologist" | "Nurse" | "Researcher" | "Patient") => {
    setSubRole(selectedSub);
    if (selectedSub === "Patient") {
      setRole("PATIENT");
    } else {
      setRole("CLINICIAN");
      if (selectedSub === "Radiologist") {
        setSpecialization("Radiology");
      } else if (selectedSub === "Doctor") {
        setSpecialization("General Practice");
      } else {
        setSpecialization(selectedSub);
      }
    }
  };

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

    if (role === "PATIENT") {
      if (!dateOfBirth.trim()) {
        newErrors.dateOfBirth = "Date of birth is required for patients";
      }
      if (!gender) {
        newErrors.gender = "Gender is required for patients";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = (): boolean => {
    const baseValid =
      fullName.trim() !== "" &&
      email.trim() !== "" &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
      password !== "" &&
      password.length >= 6 &&
      confirmPassword !== "" &&
      password === confirmPassword;

    if (role === "PATIENT") {
      return baseValid && dateOfBirth.trim() !== "";
    }

    return baseValid;
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
          dateOfBirth,
          gender,
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
          <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>

        <AuthHeader
          title={subRole === "Patient" ? "Create Patient Account" : "Create Clinical Account"}
          subtitle={subRole === "Patient"
            ? "Access your diagnostic reports securely."
            : "Join healthcare professionals using AI-assisted pneumonia screening."}
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

          <Text style={styles.roleLabel}>Account Type / Clinical Role</Text>
          <View style={styles.subRoleContainer}>
            {[
              { id: "Doctor", label: "Doctor", icon: "medical-outline" },
              { id: "Radiologist", label: "Radiologist", icon: "images-outline" },
              { id: "Nurse", label: "Nurse", icon: "pulse-outline" },
              { id: "Researcher", label: "Researcher", icon: "flask-outline" },
              { id: "Patient", label: "Patient", icon: "person-outline" },
            ].map((item) => {
              const isActive = subRole === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.subRoleCard,
                    isActive && styles.subRoleCardActive,
                  ]}
                  onPress={() => handleSubRoleSelect(item.id as any)}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={16}
                    color={isActive ? COLORS.primary : COLORS.textSecondary}
                  />
                  <Text
                    style={[
                      styles.subRoleCardText,
                      isActive && styles.subRoleCardTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {role === "CLINICIAN" && (
            <TouchableOpacity
              style={styles.selectorButton}
              onPress={() => setShowSpecializationPicker(true)}
            >
              <View style={styles.selectorButtonLeft}>
                <Ionicons name="briefcase-outline" size={18} color={COLORS.primary} />
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
              <Ionicons name="chevron-forward" size={20} color={COLORS.textTertiary} />
            </TouchableOpacity>
          )}

          {role === "PATIENT" && (
            <>
              <AuthInput
                label="Date of Birth"
                icon="calendar-outline"
                placeholder="YYYY-MM-DD"
                value={dateOfBirth}
                error={errors.dateOfBirth}
                onChangeText={(text: string) => {
                  setDateOfBirth(text);
                  if (errors.dateOfBirth)
                    setErrors({ ...errors, dateOfBirth: "" });
                }}
              />

              <TouchableOpacity
                style={styles.selectorButton}
                onPress={() => setShowGenderPicker(true)}
              >
                <View style={styles.selectorButtonLeft}>
                  <Ionicons name="person-outline" size={18} color={COLORS.primary} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.selectorButtonLabel}>Gender</Text>
                    <Text style={styles.selectorButtonValue}>{gender}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={COLORS.textTertiary} />
              </TouchableOpacity>
            </>
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
                    <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={showGenderPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowGenderPicker(false)}>
                <Ionicons name="close" size={24} color="#111827" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Select Gender</Text>
              <View style={{ width: 24 }} />
            </View>
            <ScrollView contentContainerStyle={styles.modalOptions}>
              {["MALE", "FEMALE", "OTHER"].map((g: any) => (
                <TouchableOpacity
                  key={g}
                  style={[
                    styles.specOption,
                    gender === g && styles.specOptionActive,
                  ]}
                  onPress={() => {
                    setGender(g);
                    setShowGenderPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.specOptionText,
                      gender === g && styles.specOptionTextActive,
                    ]}
                  >
                    {g}
                  </Text>
                  {gender === g && (
                    <Ionicons name="checkmark" size={20} color={COLORS.primary} />
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
    backgroundColor: COLORS.background,
    paddingTop: 50,
    paddingVertical: 20,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.card,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  form: {
    marginTop: 20,
    gap: 16,
  },
  roleLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textPrimary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  subRoleContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  subRoleCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.card,
  },
  subRoleCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  subRoleCardText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  subRoleCardTextActive: {
    color: COLORS.primary,
  },
  selectorButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.card,
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
    color: COLORS.textPrimary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  selectorButtonValue: {
    fontSize: 15,
    fontWeight: "500",
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  selectorButtonPlaceholder: {
    color: COLORS.textTertiary,
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
    color: COLORS.textSecondary,
  },
  signinLink: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: BORDER_RADIUS.lg,
    borderTopRightRadius: BORDER_RADIUS.lg,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalCloseButton: {
    fontSize: 15,
    fontWeight: "500",
    color: COLORS.textSecondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  modalConfirmButton: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
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
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.card,
  },
  specOptionActive: {
    backgroundColor: COLORS.primaryLight,
  },
  specOptionText: {
    fontSize: 15,
    fontWeight: "500",
    color: COLORS.textPrimary,
  },
  specOptionTextActive: {
    color: COLORS.primary,
    fontWeight: "600",
  },
});
