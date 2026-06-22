import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS, GRADIENTS, SHADOWS, BORDER_RADIUS, SPACING } from "../../constants/Theme";

interface WelcomeBannerProps {
  userDisplayName: string;
  notificationCount: number;
}

export const WelcomeBanner = ({
  userDisplayName,
  notificationCount,
}: WelcomeBannerProps) => {
  return (
    <LinearGradient
      colors={GRADIENTS.primary as any}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.welcomeGradient}
    >
      <View style={styles.welcomeContent}>
        <View style={styles.welcomeTextContainer}>
          <Text style={styles.welcomeGreeting}>Welcome back!</Text>
          <Text style={styles.welcomeName}>{userDisplayName}</Text>
          <Text style={styles.welcomeSubtext}>
            {notificationCount > 0
              ? `${notificationCount} updates waiting`
              : "All systems operational"}
          </Text>
        </View>
        <View style={styles.welcomeIconCircle}>
          <Ionicons name="medical" size={42} color={COLORS.primary} />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  welcomeGradient: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
    overflow: "hidden",
    ...SHADOWS.medium,
  },
  welcomeContent: {
    padding: SPACING.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  welcomeTextContainer: {
    flex: 1,
    paddingRight: 16,
  },
  welcomeGreeting: {
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  welcomeName: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  welcomeSubtext: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
    fontWeight: "500",
  },
  welcomeIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.light,
  },
});
