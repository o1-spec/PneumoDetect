import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useContext, useRef, useState } from "react";
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
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
    color: "#0066CC",
  },
  {
    id: 2,
    title: "How It Works",
    subtitle: "3 Simple Steps",
    icon: "list",
    description:
      "1. Upload a chest X-ray image\n2. Our AI analyzes the image\n3. Get detailed results and recommendations",
    color: "#0066CC",
  },
  {
    id: 3,
    title: "Your Privacy Matters",
    subtitle: "Secure & Encrypted",
    icon: "shield-checkmark",
    description:
      "Your medical data is encrypted and stored securely. We comply with healthcare privacy standards and never share your information.",
    color: "#0066CC",
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
      console.error("Failed to complete onboarding:", error);
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
          <View key={s.id} style={[styles.screen, { width: SCREEN_WIDTH }]}>
            <View style={styles.screenContent}>
              <View
                style={[styles.iconCircle, { backgroundColor: `${s.color}20` }]}
              >
                <Ionicons name={s.icon as any} size={64} color={s.color} />
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
            <TouchableOpacity
              style={[
                styles.button,
                styles.getStartedButton,
                loading && styles.buttonDisabled,
              ]}
              onPress={handleGetStarted}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Loading..." : "Get Started"}
              </Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.button, styles.skipButton]}
                onPress={handleSkip}
              >
                <Text style={styles.skipButtonText}>Skip</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.nextButton]}
                onPress={handleNext}
              >
                <Text style={styles.buttonText}>Next</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </TouchableOpacity>
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
    backgroundColor: "#FFFFFF",
  },
  screen: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  screenContent: {
    alignItems: "center",
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#8E8E93",
    marginBottom: 24,
    textAlign: "center",
  },
  descriptionBox: {
    backgroundColor: "#F5F5F7",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  description: {
    fontSize: 14,
    color: "#1C1C1E",
    lineHeight: 22,
    textAlign: "center",
  },
  footer: {
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E0E0E0",
  },
  dotActive: {
    backgroundColor: "#0066CC",
    width: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  button: {
    borderRadius: 12,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  getStartedButton: {
    flex: 1,
    backgroundColor: "#0066CC",
    shadowColor: "#0066CC",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  skipButton: {
    flex: 1,
    backgroundColor: "#F5F5F7",
  },
  nextButton: {
    flex: 1,
    backgroundColor: "#0066CC",
    shadowColor: "#0066CC",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  skipButtonText: {
    color: "#0066CC",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
