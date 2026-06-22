import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useContext, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { PremiumButton } from "../components/auth/PremiumButton";
import { AuthContext } from "../hooks/useAuth";
import { COLORS, GRADIENTS, SHADOWS, BORDER_RADIUS } from "../constants/Theme";

export default function WelcomeScreen() {
  const router = useRouter();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    checkAuthStatus();
  }, [authContext?.isSignedIn, authContext?.user?.onboardingCompleted]);

  const checkAuthStatus = async () => {
    if (authContext?.isLoading) return;

    if (authContext?.isSignedIn) {
      // Check server-side onboarding flag
      if (!authContext.user?.onboardingCompleted) {
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
      colors={GRADIENTS.light as any}
      style={styles.container}
    >
      <View style={styles.topDecor} />

      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <LinearGradient
            colors={GRADIENTS.primary as any}
            style={styles.logoGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="medical" size={54} color="#FFFFFF" />
          </LinearGradient>
        </View>
        <Text style={styles.appName}>PneumoDetect</Text>
        <Text style={styles.tagline}>AI-Powered Pneumonia Screening</Text>
      </View>

      <View style={styles.featuresContainer}>
        <FeatureItem
          icon="flash"
          title="Instant Screening"
          description="Analyze radiographs in seconds via domain-pretrained AI."
        />
        <FeatureItem
          icon="shield-checkmark"
          title="Clinical Rigor"
          description="Handles high dataset imbalance with medical domain weights."
        />
        <FeatureItem
          icon="eye"
          title="Explainable Predictions"
          description="Interpretable localized insights using Grad-CAM visual heatmaps."
        />
      </View>

      <View style={styles.buttonContainer}>
        <PremiumButton variant="primary" size="lg" onPress={handleGetStarted}>
          Get Started
        </PremiumButton>

        <PremiumButton variant="outline" size="lg" onPress={handleSignIn}>
          Sign In
        </PremiumButton>
      </View>

      <View style={styles.footer}>
        <Ionicons name="shield-checkmark" size={16} color={COLORS.primary} />
        <Text style={styles.footerText}>
          Secure Encrypted Patient Data
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
      <Ionicons name={icon} size={22} color={COLORS.primary} />
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
  topDecor: {
    position: "absolute",
    top: -80,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(79, 70, 229, 0.05)",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 20,
    zIndex: 1,
  },

  logoCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.medium,
  },

  logoGradient: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
  },

  appName: {
    fontSize: 34,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 8,
    letterSpacing: -0.8,
  },

  tagline: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },

  featuresContainer: {
    width: "100%",
    gap: 12,
    marginVertical: 20,
  },

  featureItem: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },

  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryLight,
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
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },

  featureDescription: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
    marginBottom: 16,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.primaryLight,
    borderRadius: BORDER_RADIUS.md,
  },

  footerText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textSecondary,
    letterSpacing: 0.3,
  },
});
