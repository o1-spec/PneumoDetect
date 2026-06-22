import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
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
import { useToast } from "../../hooks/useToast";
import { COLORS, SHADOWS, BORDER_RADIUS } from "../../constants/Theme";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { error: showError, success } = useToast();

  const handleResetPassword = async () => {
    if (!email) {
      showError("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      success("Password reset link has been sent to your email.");
      setTimeout(() => router.back(), 2000);
    }, 1500);
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
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>

        <AuthHeader
          title="Reset Access"
          subtitle="Enter your email to receive recovery instructions"
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
            onChangeText={setEmail}
          />

          <PremiumButton
            variant="primary"
            size="lg"
            loading={loading}
            disabled={!email || loading}
            onPress={handleResetPassword}
            style={styles.sendButton}
          >
            Send Reset Link
          </PremiumButton>

          <TouchableOpacity
            style={styles.backToSignIn}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={16} color={COLORS.primary} />
            <Text style={styles.backToSignInText}>Back to Sign In</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <View style={styles.infoIconWrapper}>
            <Ionicons name="information-circle" size={20} color={COLORS.primary} />
          </View>
          <Text style={styles.infoText}>
            If an account exists with this email, you will receive password
            reset instructions.
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
    paddingHorizontal: 20,
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
  sendButton: {
    marginBottom: 16,
  },
  backToSignIn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    gap: 6,
  },
  backToSignInText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    padding: 14,
    gap: 12,
  },
  infoIconWrapper: {
    paddingTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.primary,
    lineHeight: 19,
    fontWeight: "500",
  },
});
