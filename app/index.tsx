import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useContext, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { PremiumButton } from "../components/auth/PremiumButton";
import { AuthContext } from "../hooks/useAuth";
import { hasSeenOnboarding } from "../utils/secureStorage";

export default function WelcomeScreen() {
  const router = useRouter();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    checkAuthStatus();
  }, [authContext?.isSignedIn]);

  const checkAuthStatus = async () => {
    if (authContext?.isLoading) return;

    if (authContext?.isSignedIn) {
      const seenOnboarding = await hasSeenOnboarding();
      if (!seenOnboarding) {
        router.replace("/(onboarding)");
      } else {
        // Route based on user role
        if (authContext.user?.role === "PATIENT") {
          router.replace("/(patient)");
        } else {
          router.replace("/(tabs)");
        }
      }
    }
  };

  const handleGetStarted = () => {
    router.push("/(auth)/signup");
  };

  const handleSignIn = () => {
    router.push("/(auth)/login");
  };

  return (
    <LinearGradient
      colors={["#FAFBFC", "#F3F4F6", "#E5E7EB"]}
      style={styles.container}
    >
      {/* Decorative Top Circle */}
      <View style={styles.topDecor} />

      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Ionicons name="medical" size={60} color="#0B5ED7" />
        </View>
        <Text style={styles.appName}>PneumoDetect</Text>
        <Text style={styles.tagline}>AI-Powered Pneumonia Detection</Text>
      </View>

      {/* Features Section */}
      <View style={styles.featuresContainer}>
        <FeatureItem
          icon="flash-outline"
          title="Fast Analysis"
          description="Get results in seconds with our advanced AI model"
        />
        <FeatureItem
          icon="checkmark-circle-outline"
          title="94.5% Accuracy"
          description="Clinically validated and FDA-approved detection"
        />
        <FeatureItem
          icon="analytics-outline"
          title="Explainable AI"
          description="Visualize and understand AI decision-making"
        />
      </View>

      {/* CTA Buttons */}
      <View style={styles.buttonContainer}>
        <PremiumButton variant="primary" size="lg" onPress={handleGetStarted}>
          Get Started
        </PremiumButton>

        <PremiumButton variant="outline" size="lg" onPress={handleSignIn}>
          Sign In
        </PremiumButton>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Ionicons name="shield-checkmark-outline" size={16} color="#0B5ED7" />
        <Text style={styles.footerText}>
          Secure • HIPAA Compliant • FDA Approved
        </Text>
      </View>
    </LinearGradient>
  );
}

const FeatureItem = ({
  icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) => (
  <View style={styles.featureItem}>
    <View style={styles.featureIcon}>
      <Ionicons name={icon} size={24} color="#0066CC" />
    </View>
    <View style={styles.featureText}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 24,
  },

  /* Decorative Elements */
  topDecor: {
    position: "absolute",
    top: -80,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(11, 94, 215, 0.08)",
  },

  /* Logo Section */
  logoContainer: {
    alignItems: "center",
    marginTop: 20,
    zIndex: 1,
  },

  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "#E0E7FF",
    shadowColor: "#0B5ED7",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },

  appName: {
    fontSize: 36,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    letterSpacing: -0.5,
  },

  tagline: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
  },

  /* Features Section */
  featuresContainer: {
    width: "100%",
    gap: 12,
    marginVertical: 20,
  },

  featureItem: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E0E7FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    flexShrink: 0,
  },

  featureText: {
    flex: 1,
  },

  featureTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },

  featureDescription: {
    fontSize: 13,
    fontWeight: "400",
    color: "#6B7280",
    lineHeight: 18,
  },

  /* Button Section */
  buttonContainer: {
    width: "100%",
    gap: 12,
    marginBottom: 16,
  },

  /* Footer */
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(11, 94, 215, 0.08)",
    borderRadius: 8,
  },

  footerText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
    letterSpacing: 0.3,
  },
});
