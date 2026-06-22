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
          title="Chest X-Ray Analysis"
          subtitle="Sign in to access AI-assisted diagnostic tools"
        />

        {/* Radiology Visual Mockup */}
        <View style={styles.radiologyVisual}>
          <View style={styles.radiologyScanHeader}>
            <View style={styles.radiologyScanDot} />
            <Text style={styles.radiologyScanHeaderText}>SYS-STATUS: ACTIVE // DIAGNOSTIC_ENGINE</Text>
          </View>
          <View style={styles.radiologyScanBody}>
            {/* Styled skeletal/lung-like clinical visual using UI shapes */}
            <View style={styles.xrayFrame}>
              <View style={styles.ribCageLeft}>
                <View style={[styles.ribLine, { width: 22, transform: [{ rotate: "15deg" }] }]} />
                <View style={[styles.ribLine, { width: 26, transform: [{ rotate: "10deg" }] }]} />
                <View style={[styles.ribLine, { width: 24, transform: [{ rotate: "5deg" }] }]} />
              </View>
              <View style={styles.ribCageCenter}>
                <View style={styles.spineLine} />
              </View>
              <View style={styles.ribCageRight}>
                <View style={[styles.ribLine, { width: 22, transform: [{ rotate: "-15deg" }] }]} />
                <View style={[styles.ribLine, { width: 26, transform: [{ rotate: "-10deg" }] }]} />
                <View style={[styles.ribLine, { width: 24, transform: [{ rotate: "-5deg" }] }]} />
              </View>
            </View>
            <View style={styles.radiologyMeta}>
              <Text style={styles.radiologyMetaTitle}>PneumoDetect AI Engine</Text>
              <Text style={styles.radiologyMetaSub}>High-resolution scan screening ready</Text>
            </View>
          </View>
        </View>

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

          {/* Trust Signals */}
          <View style={styles.trustSignals}>
            <View style={styles.trustItem}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
              <Text style={styles.trustText}>AI-assisted diagnosis support</Text>
            </View>
            <View style={styles.trustItem}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
              <Text style={styles.trustText}>Explainable Grad-CAM analysis</Text>
            </View>
            <View style={styles.trustItem}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
              <Text style={styles.trustText}>Secure encrypted patient data</Text>
            </View>
          </View>

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
  radiologyVisual: {
    backgroundColor: "#1E293B",
    borderRadius: BORDER_RADIUS.md,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#334155",
  },
  radiologyScanHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
    paddingBottom: 6,
  },
  radiologyScanDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.secondary,
    marginRight: 6,
  },
  radiologyScanHeaderText: {
    fontSize: 9,
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
    color: "#94A3B8",
    letterSpacing: 1,
  },
  radiologyScanBody: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  xrayFrame: {
    width: 70,
    height: 44,
    backgroundColor: "#0F172A",
    borderRadius: 6,
    flexDirection: "row",
    padding: 6,
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#475569",
  },
  ribCageLeft: {
    alignItems: "flex-end",
    gap: 4,
  },
  ribCageCenter: {
    width: 2,
    height: "100%",
    backgroundColor: "#475569",
    alignSelf: "center",
  },
  ribCageRight: {
    alignItems: "flex-start",
    gap: 4,
  },
  ribLine: {
    height: 2,
    backgroundColor: "#334155",
    opacity: 0.8,
  },
  spineLine: {
    width: 2,
    height: "100%",
    backgroundColor: COLORS.secondary,
    opacity: 0.6,
  },
  radiologyMeta: {
    flex: 1,
    marginLeft: 12,
  },
  radiologyMetaTitle: {
    color: "#F8FAFC",
    fontSize: 13,
    fontWeight: "600",
  },
  radiologyMetaSub: {
    color: "#94A3B8",
    fontSize: 11,
    marginTop: 2,
  },
  trustSignals: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    padding: 12,
    marginBottom: 20,
    gap: 8,
  },
  trustItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  trustText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "500",
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
