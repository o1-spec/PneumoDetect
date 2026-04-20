import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useRef, useState } from "react";
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
import { AuthHeader } from "../../components/auth/AuthHeader";
import { PremiumButton } from "../../components/auth/PremiumButton";
import { AuthContext } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { getErrorMessage } from "../../utils/errorHandler";
import { hasSeenOnboarding } from "../../utils/secureStorage";

export default function OTPVerificationScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [error, setError] = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { success, error: showError } = useToast();
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return <Text>Auth context not available</Text>;
  }

  const { verifyOTP, resendOTP } = authContext;

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startResendTimer = () => {
    setResendTimer(60);
    timerRef.current = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError("Please enter a 6-digit OTP");
      return;
    }

    if (!email) {
      setError("Email not found");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await verifyOTP({ email, otp });
      success("Email verified successfully!");

      const seenOnboarding = await hasSeenOnboarding();
      if (seenOnboarding) {
        router.replace("/(tabs)");
      } else {
        router.replace("/(onboarding)");
      }
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      setError("Email not found");
      return;
    }

    setResendLoading(true);
    setError("");

    try {
      await resendOTP(email);
      success("OTP sent to your email!");
      startResendTimer();
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setResendLoading(false);
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
            router.canGoBack() ? router.back() : router.push("/(auth)/signup")
          }
        >
          <Ionicons name="chevron-back" size={24} color="#0B5ED7" />
        </TouchableOpacity>

        <AuthHeader
          icon="mail-outline"
          title="Verify Email"
          subtitle={`We sent a 6-digit code to ${email}`}
        />

        <View style={styles.form}>
          <Text style={styles.otpLabel}>Enter Code</Text>
          <TextInput
            style={[styles.otpInput, error && styles.otpInputError]}
            placeholder="000000"
            placeholderTextColor="#D1D5DB"
            value={otp}
            onChangeText={(text) => {
              if (/^\d{0,6}$/.test(text)) {
                setOtp(text);
                setError("");
              }
            }}
            keyboardType="numeric"
            maxLength={6}
            autoFocus
          />
          {error && <Text style={styles.errorText}>{error}</Text>}

          <PremiumButton
            variant="primary"
            size="lg"
            loading={loading}
            disabled={loading || otp.length !== 6}
            onPress={handleVerifyOTP}
          >
            Verify Code
          </PremiumButton>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive the code? </Text>
            {resendTimer > 0 ? (
              <Text style={styles.resendTimerText}>
                Resend in {resendTimer}s
              </Text>
            ) : (
              <TouchableOpacity
                onPress={handleResendOTP}
                disabled={resendLoading}
              >
                <Text
                  style={[
                    styles.resendLink,
                    resendLoading && styles.resendLinkDisabled,
                  ]}
                >
                  {resendLoading ? "Sending..." : "Resend"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
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
  otpLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  otpInput: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    textAlign: "center",
    letterSpacing: 6,
  },
  otpInputError: {
    borderColor: "#EF4444",
    backgroundColor: "#FEE2E2",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 8,
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  resendText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  resendLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0B5ED7",
  },
  resendLinkDisabled: {
    opacity: 0.5,
  },
  resendTimerText: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "500",
  },
});
