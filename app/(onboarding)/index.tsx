import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useContext, useRef, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View, Platform } from "react-native";
import Svg, { Path, Rect, Circle, Defs, RadialGradient, Stop, G } from "react-native-svg";
import { PremiumButton } from "../../components/auth/PremiumButton";
import { AuthContext } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import api from "../../services/api";
import { getErrorMessage } from "../../utils/errorHandler";
import { logger } from "../../utils/logger";
import { COLORS, SHADOWS, BORDER_RADIUS } from "../../constants/Theme";

const SCREEN_WIDTH = Dimensions.get("window").width;

/**
 * Programmatic vector Chest X-ray silhouette representation
 */
interface ClinicalXrayProps {
  showHeatmap?: boolean;
  showMarker?: boolean;
}

const ClinicalXraySvg: React.FC<ClinicalXrayProps> = ({
  showHeatmap = false,
  showMarker = false,
}) => {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 240 180">
      <Defs>
        <RadialGradient id="gradCam" cx="50%" cy="50%" rx="50%" ry="50%">
          <Stop offset="0%" stopColor="#EF4444" stopOpacity="0.75" />
          <Stop offset="40%" stopColor="#F59E0B" stopOpacity="0.5" />
          <Stop offset="70%" stopColor="#EAB308" stopOpacity="0.2" />
          <Stop offset="100%" stopColor="#EAB308" stopOpacity="0" />
        </RadialGradient>
      </Defs>

      {/* Viewbox backing */}
      <Rect x="0" y="0" width="240" height="180" rx="8" fill="#0B1329" />

      {/* Symmetrical Left/Right Lung air field backdrops */}
      <Path
        d="M 50 20 C 30 20, 22 50, 22 120 C 22 150, 30 160, 55 160 C 70 160, 95 130, 95 100 C 95 60, 90 20, 50 20 Z"
        fill="#060A16"
      />
      <Path
        d="M 190 20 C 210 20, 218 50, 218 120 C 218 150, 210 160, 185 160 C 170 160, 145 130, 145 100 C 145 60, 150 20, 190 20 Z"
        fill="#060A16"
      />

      {/* Central Mediastinal Shadow / Spine Outline */}
      <Path
        d="M 102 10 L 138 10 L 138 170 C 148 160, 152 140, 152 110 C 152 90, 132 75, 132 50 L 132 10 L 102 10 Z"
        fill="#1E293B"
        opacity="0.5"
      />

      {/* Heart Contour */}
      <Path
        d="M 120 75 C 120 75, 94 90, 94 115 C 94 138, 120 148, 120 148 Z"
        fill="#1E293B"
        opacity="0.75"
      />

      {/* Left Rib Structures */}
      <Path d="M 24 55 Q 55 52, 92 65" stroke="#1E293B" strokeWidth="2.5" fill="none" opacity="0.6" />
      <Path d="M 22 75 Q 55 72, 94 85" stroke="#1E293B" strokeWidth="2.5" fill="none" opacity="0.6" />
      <Path d="M 22 98 Q 55 95, 95 105" stroke="#1E293B" strokeWidth="2.5" fill="none" opacity="0.6" />
      <Path d="M 24 120 Q 55 118, 93 125" stroke="#1E293B" strokeWidth="2.5" fill="none" opacity="0.6" />
      <Path d="M 30 140 Q 55 138, 85 142" stroke="#1E293B" strokeWidth="2.5" fill="none" opacity="0.5" />

      {/* Right Rib Structures */}
      <Path d="M 216 55 Q 185 52, 148 65" stroke="#1E293B" strokeWidth="2.5" fill="none" opacity="0.6" />
      <Path d="M 218 75 Q 185 72, 146 85" stroke="#1E293B" strokeWidth="2.5" fill="none" opacity="0.6" />
      <Path d="M 218 98 Q 185 95, 145 105" stroke="#1E293B" strokeWidth="2.5" fill="none" opacity="0.6" />
      <Path d="M 216 120 Q 185 118, 147 125" stroke="#1E293B" strokeWidth="2.5" fill="none" opacity="0.6" />
      <Path d="M 210 140 Q 185 138, 155 142" stroke="#1E293B" strokeWidth="2.5" fill="none" opacity="0.5" />

      {/* Clavicles */}
      <Path d="M 120 30 Q 80 25, 30 35" stroke="#334155" strokeWidth="3" fill="none" opacity="0.6" />
      <Path d="M 120 30 Q 160 25, 210 35" stroke="#334155" strokeWidth="3" fill="none" opacity="0.6" />

      {/* Subtle Scan Overlay (Horizontal scanning indicator) */}
      {!showHeatmap && !showMarker && (
        <G>
          <Rect x="15" y="85" width="210" height="2" fill="#0EA5A4" opacity="0.6" />
        </G>
      )}

      {/* Suspected Region Bounding Box (Slide 1) */}
      {showMarker && (
        <G>
          <Rect x="38" y="92" width="46" height="42" rx="3" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeDasharray="3,3" />
          <Rect x="38" y="82" width="38" height="10" rx="1.5" fill="#2563EB" />
          <Circle cx="84" cy="92" r="2.5" fill="#2563EB" />
        </G>
      )}

      {/* Grad-CAM style heatmap overlay (Slide 2) */}
      {showHeatmap && (
        <G>
          <Circle cx="60" cy="115" r="32" fill="url(#gradCam)" />
          <Circle cx="178" cy="96" r="18" fill="url(#gradCam)" opacity="0.65" />
        </G>
      )}
    </Svg>
  );
};

export default function OnboardingScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentScreen, setCurrentScreen] = useState(0);
  const [loading, setLoading] = useState(false);

  const { success, error: showError } = useToast();
  const authContext = useContext(AuthContext);

  const SCREENS = [
    {
      id: 1,
      title: "Chest X-Ray Analysis",
      subtitle: "Helping clinicians identify potential pneumonia faster.",
      type: "xray",
    },
    {
      id: 2,
      title: "Explainable Predictions",
      subtitle: "Visual heatmaps reveal the areas influencing each result.",
      type: "heatmap",
    },
    {
      id: 3,
      title: "Clinical Decision Support",
      subtitle: "Review findings, confidence scores, and patient history in one place.",
      type: "dashboard",
    },
  ];

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

  // Renderer for Slide 1 visual
  const renderXrayVisual = () => {
    return (
      <View style={styles.viewboxPanel}>
        <View style={styles.radiologyHeader}>
          <Text style={styles.radiologyHeaderText}>PANEL 01 // PULMONARY SCAN</Text>
          <View style={styles.statusDot} />
        </View>
        <View style={styles.svgWrapper}>
          <ClinicalXraySvg showMarker={true} />
        </View>
        <View style={styles.radiologyFooter}>
          <Text style={styles.radiologyFooterText}>DETECTION SCANNER ACTIVE</Text>
        </View>
      </View>
    );
  };

  // Renderer for Slide 2 visual
  const renderHeatmapVisual = () => {
    return (
      <View style={styles.viewboxPanel}>
        <View style={styles.radiologyHeader}>
          <Text style={styles.radiologyHeaderText}>GRAD-CAM AI HEATMAP OVERLAY</Text>
          <View style={[styles.statusDot, { backgroundColor: COLORS.secondary }]} />
        </View>
        <View style={styles.svgWrapper}>
          <ClinicalXraySvg showHeatmap={true} />
        </View>
        <View style={styles.radiologyFooter}>
          <Text style={styles.radiologyFooterText}>ATTENTION MAP CONGRUENCE</Text>
        </View>
      </View>
    );
  };

  // Renderer for Slide 3 visual
  const renderDashboardVisual = () => {
    return (
      <View style={styles.dashboardPreviewContainer}>
        <View style={styles.miniXrayContainer}>
          <ClinicalXraySvg showHeatmap={true} />
        </View>

        <View style={styles.dashboardCard}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.patientId}>ID: PX-92041</Text>
              <Text style={styles.patientMeta}>61M // Chest PA Standing</Text>
            </View>
            <View style={styles.findingsBadge}>
              <Text style={styles.findingsBadgeText}>PNEUMONIA RISK</Text>
            </View>
          </View>

          <View style={styles.cardDivider} />

          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>AI Confidence</Text>
            <Text style={styles.metricValue}>92.4%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: "92.4%" }]} />
          </View>

          <View style={styles.cardDivider} />

          <View style={styles.statusRow}>
            <View style={styles.statusInfo}>
              <Ionicons name="time-outline" size={14} color={COLORS.secondary} />
              <Text style={styles.statusText}>Awaiting Review</Text>
            </View>
            <Text style={styles.priorityLabel}>HIGH PRIORITY</Text>
          </View>
        </View>
      </View>
    );
  };

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
        contentOffset={{ x: currentScreen * SCREEN_WIDTH, y: 0 }}
      >
        {SCREENS.map((s) => (
          <View key={s.id} style={styles.screen}>
            <View style={styles.visualContainer}>
              {s.type === "xray" && renderXrayVisual()}
              {s.type === "heatmap" && renderHeatmapVisual()}
              {s.type === "dashboard" && renderDashboardVisual()}
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.title}>{s.title}</Text>
              <Text style={styles.subtitle}>{s.subtitle}</Text>
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
    paddingTop: Platform.OS === "ios" ? 40 : 20,
  },
  visualContainer: {
    height: SCREEN_WIDTH * 0.75,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  // Viewbox styles (Radiology panel look)
  viewboxPanel: {
    width: "100%",
    height: "100%",
    backgroundColor: "#0B1329",
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5,
    borderColor: "#1E293B",
    padding: 12,
    justifyContent: "space-between",
    ...SHADOWS.medium,
  },
  radiologyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#1E293B",
    paddingBottom: 6,
  },
  radiologyHeaderText: {
    fontSize: 10,
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
    color: "#64748B",
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
  svgWrapper: {
    flex: 1,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  radiologyFooter: {
    borderTopWidth: 1,
    borderTopColor: "#1E293B",
    paddingTop: 6,
  },
  radiologyFooterText: {
    fontSize: 9,
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
    color: "#475569",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  // Dashboard mock styles
  dashboardPreviewContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.primaryLight,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    position: "relative",
  },
  miniXrayContainer: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 50,
    height: 38,
    borderRadius: 4,
    overflow: "hidden",
    opacity: 0.85,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dashboardCard: {
    width: "100%",
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    ...SHADOWS.light,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  patientId: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
  },
  patientMeta: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  findingsBadge: {
    backgroundColor: COLORS.dangerLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  findingsBadgeText: {
    color: COLORS.danger,
    fontSize: 9,
    fontWeight: "700",
  },
  cardDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 10,
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  metricValue: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.primary,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  priorityLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: COLORS.danger,
  },
  // Text area styles
  textContainer: {
    alignItems: "flex-start",
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 8,
    textAlign: "left",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: "left",
    lineHeight: 22,
    fontWeight: "500",
  },
  // Footer styles
  footer: {
    paddingBottom: 48,
    paddingHorizontal: 24,
    paddingTop: 16,
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
    backgroundColor: COLORS.border,
  },
  dotActive: {
    backgroundColor: COLORS.primary,
    width: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    width: "100%",
  },
});
