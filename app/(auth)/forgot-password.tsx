import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
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

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        "Success",
        "Password reset link has been sent to your email.",
        [{ text: "OK", onPress: () => router.back() }],
      );
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
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#0B5ED7" />
        </TouchableOpacity>

        {/* Header */}
        <AuthHeader
          icon="key-outline"
          title="Reset Password"
          subtitle="Enter your email address and we'll send you a reset link"
        />

        {/* Form */}
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

          {/* Send Button */}
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

          {/* Back to Sign In */}
          <TouchableOpacity
            style={styles.backToSignIn}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={16} color="#0B5ED7" />
            <Text style={styles.backToSignInText}>Back to Sign In</Text>
          </TouchableOpacity>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <View style={styles.infoIconWrapper}>
            <Ionicons name="information-circle" size={20} color="#0B5ED7" />
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
    backgroundColor: "#FAFBFC",
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
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
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
    color: "#0B5ED7",
    fontSize: 14,
    fontWeight: "600",
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#F0F4FF",
    borderWidth: 1,
    borderColor: "#E0E7FF",
    borderRadius: 10,
    padding: 14,
    gap: 12,
  },
  infoIconWrapper: {
    paddingTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#0B5ED7",
    lineHeight: 19,
    fontWeight: "500",
  },
});
