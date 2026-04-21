import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useContext, useRef, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { PremiumButton } from "../../components/auth/PremiumButton";
import { AuthContext } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { storeOnboardingFlag } from "../../utils/secureStorage";

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
    color: "#0B5ED7",
  },
  {
    id: 2,
    title: "How It Works",
    subtitle: "3 Simple Steps",
    icon: "layers-outline",
    description:
      "1. Upload a chest X-ray image\n2. Our AI analyzes the image\n3. Get detailed results and recommendations",
    color: "#0B5ED7",
  },
  {
    id: 3,
    title: "Your Privacy Matters",
    subtitle: "Secure & Encrypted",
    icon: "shield-checkmark-outline",
    description:
      "Your medical data is encrypted and stored securely. We comply with healthcare privacy standards and never share your information.",
    color: "#0B5ED7",
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentScreen, setCurrentScreen] = useState(0);
  const [loading, setLoading] = useState(false);

  const { success } = useToast();
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
      await storeOnboardingFlag(true);
      success("Welcome aboard!");
      router.replace("/(tabs)");
    } catch (error) {
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
        scrollEnabled={false}
      >
        {SCREENS.map((s) => (
          <View style={styles.screen}>
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
            >
              Get Started
            </PremiumButton>
          ) : (
            <>
              <PremiumButton variant="outline" size="lg" onPress={handleSkip}>
                Skip
              </PremiumButton>

              <PremiumButton variant="primary" size="lg" onPress={handleNext}>
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
    backgroundColor: "#FAFBFC",
  },
  screen: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
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
    borderWidth: 2,
    borderColor: "#E0E7FF",
    shadowColor: "#0B5ED7",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: -0.7,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 32,
    textAlign: "center",
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  descriptionBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 28,
    marginTop: 32,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  description: {
    fontSize: 15,
    color: "#111827",
    lineHeight: 26,
    textAlign: "center",
    fontWeight: "500",
  },
  footer: {
    paddingBottom: 48,
    paddingHorizontal: 20,
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
    backgroundColor: "#E5E7EB",
  },
  dotActive: {
    backgroundColor: "#0B5ED7",
    width: 32,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
});
