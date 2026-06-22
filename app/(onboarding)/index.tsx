import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useContext, useRef, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { PremiumButton } from "../../components/auth/PremiumButton";
import { AuthContext } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import api from "../../services/api";
import { getErrorMessage } from "../../utils/errorHandler";
import { logger } from "../../utils/logger";
import { COLORS, SHADOWS, BORDER_RADIUS } from "../../constants/Theme";

const SCREEN_WIDTH = Dimensions.get("window").width;

interface OnboardingScreen {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  description: string;
  color: string;
}

const SCREENS: OnboardingScreen[] = [
  {
    id: 1,
    title: "Welcome to PneumoDetect",
    subtitle: "AI-Powered Pneumonia Detection",
    icon: "pulse",
    description:
      "Quickly and accurately detect pneumonia using advanced AI technology. Simply upload a chest X-ray and get results in seconds.",
    color: COLORS.primary,
  },
  {
    id: 2,
    title: "How It Works",
    subtitle: "3 Simple Steps",
    icon: "layers-outline",
    description:
      "1. Upload a chest X-ray image\n2. Our AI analyzes the image\n3. Get detailed results and recommendations",
    color: COLORS.secondary,
  },
  {
    id: 3,
    title: "Your Privacy Matters",
    subtitle: "Secure & Encrypted",
    icon: "shield-checkmark-outline",
    description:
      "Your medical data is encrypted and stored securely. We comply with healthcare privacy standards and never share your information.",
    color: COLORS.success,
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentScreen, setCurrentScreen] = useState(0);
  const [loading, setLoading] = useState(false);

  const { success, error: showError } = useToast();
  const authContext = useContext(AuthContext);

  const handleNext = () => {
    if (currentScreen < SCREENS.length - 1) {
      setCurrentScreen(currentScreen + 1);
      scrollViewRef.current?.scrollTo({
        x: (currentScreen + 1) * SCREEN_WIDTH,
        animated: true,
      });
    }
  };

  const handleSkip = async () => {
    await completeOnboarding();
  };

  const handleGetStarted = async () => {
    await completeOnboarding();
  };

  const completeOnboarding = async () => {
    setLoading(true);
    try {
      await api.post("/users/onboarding/complete");

      if (authContext?.refreshUser) {
        await authContext.refreshUser();
      }

      success("Welcome aboard!");

      await new Promise((resolve) => setTimeout(resolve, 500));

      const updatedRole = authContext?.user?.role;
      if (updatedRole === "PATIENT") {
        router.replace("/(patient)");
      } else {
        router.replace("/(tabs)");
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      logger.error("Onboarding completion failed", { error: String(error) });
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / SCREEN_WIDTH);
    setCurrentScreen(currentIndex);
  };

  const screen = SCREENS[currentScreen];

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        onScroll={handleScroll}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={true}
        decelerationRate="fast"
      >
        {SCREENS.map((s) => (
          <View key={s.id} style={styles.screen}>
            <View style={styles.screenContent}>
              <View style={styles.iconContainer}>
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: `${s.color}15` },
                  ]}
                >
                  <Ionicons name={s.icon as any} size={80} color={s.color} />
                </View>
              </View>

              <Text style={styles.title}>{s.title}</Text>
              <Text style={styles.subtitle}>{s.subtitle}</Text>

              <View style={styles.descriptionBox}>
                <Text style={styles.description}>{s.description}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.dotsContainer}>
          {SCREENS.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, index === currentScreen && styles.dotActive]}
            />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          {currentScreen === SCREENS.length - 1 ? (
            <PremiumButton
              variant="primary"
              size="lg"
              loading={loading}
              disabled={loading}
              onPress={handleGetStarted}
              style={{ flex: 1 }}
            >
              Get Started
            </PremiumButton>
          ) : (
            <>
              <PremiumButton
                variant="outline"
                size="lg"
                onPress={handleSkip}
                style={{ flex: 1 }}
              >
                Skip
              </PremiumButton>

              <PremiumButton
                variant="primary"
                size="lg"
                onPress={handleNext}
                style={{ flex: 1 }}
              >
                Next
              </PremiumButton>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  screen: {
    width: SCREEN_WIDTH,
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  screenContent: {
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: COLORS.border,
    ...SHADOWS.medium,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: -0.7,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 32,
    textAlign: "center",
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  descriptionBox: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: 24,
    marginTop: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  description: {
    fontSize: 15,
    color: COLORS.textPrimary,
    lineHeight: 24,
    textAlign: "center",
    fontWeight: "500",
  },
  footer: {
    paddingBottom: 48,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.border,
  },
  dotActive: {
    backgroundColor: COLORS.primary,
    width: 32,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    width: "100%",
  },
});
