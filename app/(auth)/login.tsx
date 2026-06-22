import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useContext, useState } from "react";
import {
    KeyboardAvoidingView,
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
import { COLORS, SHADOWS, BORDER_RADIUS } from "../../constants/Theme";
import { getErrorMessage } from "../../utils/errorHandler";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { success, error: showError } = useToast();

  const authContext = useContext(AuthContext);
  if (!authContext) {
    return <Text>Auth context not available</Text>;
  }

  const { login } = authContext;

  const isFormValid = (): boolean => {
    return (
      email.trim() !== "" &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
      password !== ""
    );
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await login({ email, password });
      success("Login successful!");
      router.replace("/(tabs)");
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);

      if (error?.isNotVerified || errorMessage.includes("not verified")) {
        router.push({
          pathname: "/(auth)/otp-verification",
          params: { email },
        });
        success("Please verify your email with OTP");
      } else {
        showError(errorMessage);
      }
    } finally {
      setIsLoading(false);
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
          <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>

        <AuthHeader
          icon="log-in-outline"
          title="Welcome Back"
          subtitle="Sign in to your PneumoDetect account"
        />

        <View style={styles.form}>
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

          <TouchableOpacity
            onPress={() => router.push("/(auth)/forgot-password")}
            style={styles.forgotPasswordButton}
          >
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>

          <PremiumButton
            variant="primary"
            size="lg"
            loading={isLoading}
            disabled={!isFormValid() || isLoading}
            onPress={handleLogin}
            style={styles.loginButton}
          >
            Sign In
          </PremiumButton>

          {/* Sign Up Link */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Secure AI-powered pneumonia detection for clinical use.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 50,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.card,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  form: {
    marginBottom: 32,
  },
  forgotPasswordButton: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  loginButton: {
    marginBottom: 20,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },
  signupText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: "500",
  },
  signupLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  footer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingTop: 20,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textTertiary,
    textAlign: "center",
    fontStyle: "italic",
  },
});
