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
import { AuthContext } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { getErrorMessage } from "../../utils/errorHandler";

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
      router.replace("/(onboarding)");
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
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Ionicons name="mail-outline" size={48} color="#0066CC" />
          </View>
          <Text style={styles.title}>Verify Email</Text>
          <Text style={styles.subtitle}>We sent a 6-digit code to {email}</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Enter OTP</Text>
            <TextInput
              style={[styles.otpInput, error && styles.otpInputError]}
              placeholder="000000"
              placeholderTextColor="#8E8E93"
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
          </View>

          <TouchableOpacity
            style={[
              styles.verifyButton,
              (loading || otp.length !== 6) && styles.verifyButtonDisabled,
            ]}
            onPress={handleVerifyOTP}
            disabled={loading || otp.length !== 6}
          >
            <Text style={styles.verifyButtonText}>
              {loading ? "Verifying..." : "Verify"}
            </Text>
          </TouchableOpacity>

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
    backgroundColor: "#F5F5F7",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
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
    textAlign: "center",
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
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 12,
  },
  otpInput: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1C1C1E",
    backgroundColor: "#F5F5F7",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    textAlign: "center",
    letterSpacing: 8,
  },
  otpInputError: {
    borderWidth: 2,
    borderColor: "#D32F2F",
    backgroundColor: "#FFEBEE",
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 12,
    marginTop: 8,
  },
  verifyButton: {
    backgroundColor: "#0066CC",
    borderRadius: 12,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#0066CC",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  verifyButtonDisabled: {
    opacity: 0.5,
    backgroundColor: "#CCCCCC",
  },
  verifyButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 16,
  },
  resendText: {
    color: "#8E8E93",
    fontSize: 14,
  },
  resendLink: {
    color: "#0066CC",
    fontSize: 14,
    fontWeight: "600",
  },
  resendLinkDisabled: {
    opacity: 0.5,
  },
  resendTimerText: {
    color: "#8E8E93",
    fontSize: 14,
    fontWeight: "600",
  },
});
