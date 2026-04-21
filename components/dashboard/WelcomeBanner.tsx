import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

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
      colors={["#0B5ED7", "#0B5ED7", "#1E6FDD"]}
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
          <Ionicons name="medical" size={48} color="#FFFFFF" />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  welcomeGradient: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    marginBottom: 24,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#0B5ED7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  welcomeContent: {
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  welcomeTextContainer: {
    flex: 1,
    paddingRight: 16,
  },
  welcomeGreeting: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  welcomeName: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 6,
  },
  welcomeSubtext: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
    fontWeight: "500",
  },
  welcomeIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
});
