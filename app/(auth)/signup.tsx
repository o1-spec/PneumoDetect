import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import React, { useContext, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthContext } from "../../hooks/useAuth";
import { RegisterRequest } from "../../types/api";
import { getErrorMessage } from "../../utils/errorHandler";

export default function SignUpScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"CLINICIAN" | "ADMIN">("CLINICIAN");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
        specialization: specialization || undefined,
        phone: phone || undefined,
      };

      await register(registerData);

      Alert.alert("Success", "Account created successfully!", [
        {
          text: "OK",
          onPress: () => router.replace("/(tabs)"),
        },
      ]);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      Alert.alert("Registration Failed", errorMessage);
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
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            router.canGoBack() ? router.back() : router.push("/")
          }
        >
          <Ionicons name="arrow-back" size={24} color="#0066CC" />
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Ionicons name="person-add" size={48} color="#0066CC" />
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join PneumoDetect AI</Text>
        </View>

        {/* Sign Up Form */}
        <View style={styles.form}>
          {/* Full Name */}
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

          {/* Email */}
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

          {/* Role Selection */}
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
                  role === "ADMIN" && styles.roleButtonActive,
                ]}
                onPress={() => setRole("ADMIN")}
              >
                <Ionicons
                  name="shield-checkmark"
                  size={20}
                  color={role === "ADMIN" ? "#FFFFFF" : "#0066CC"}
                />
                <Text
                  style={[
                    styles.roleButtonText,
                    role === "ADMIN" && styles.roleButtonTextActive,
                  ]}
                >
                  Admin
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Specialization (optional for clinicians) */}
          {role === "CLINICIAN" && (
            <View style={styles.inputContainer}>
              <Ionicons
                name="briefcase-outline"
                size={20}
                color="#8E8E93"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Specialization (Optional)"
                placeholderTextColor="#8E8E93"
                value={specialization}
                onChangeText={setSpecialization}
                autoCapitalize="words"
              />
            </View>
          )}

          {/* Phone (optional) */}
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

          {/* Password */}
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

          {/* Confirm Password */}
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
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
            </View>
            {errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            style={[
              styles.signUpButton,
              loading && styles.signUpButtonDisabled,
            ]}
            onPress={handleSignUp}
            disabled={loading}
          >
            <Text style={styles.signUpButtonText}>
              {loading ? "Creating Account..." : "Create Account"}
            </Text>
          </TouchableOpacity>

          {/* Login Link */}
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
    opacity: 0.6,
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
});
