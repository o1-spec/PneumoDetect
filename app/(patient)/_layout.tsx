import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import React from "react";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../hooks/useAuth";
import { PneumoLoader } from "../../components/premium";

export default function PatientLayout() {
  const { user, isLoading, isSignedIn } = useAuth();
  const insets = useSafeAreaInsets();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FAFBFC" }}>
        <PneumoLoader size={64} />
      </View>
    );
  }

  if (!isSignedIn || user?.role !== "PATIENT") {
    return <Redirect href="/" />;
  }

  // Calculate dynamic heights and paddings to prevent clipping on both Android & iOS gesture bars
  const tabHeight = Platform.OS === "ios"
    ? (insets.bottom > 0 ? 88 : 64)
    : (insets.bottom > 0 ? 76 : 64);
    
  const tabPaddingBottom = Platform.OS === "ios"
    ? (insets.bottom > 0 ? insets.bottom + 4 : 8)
    : (insets.bottom > 0 ? insets.bottom + 6 : 8);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#0066CC",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          marginTop: 4,
        },
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E5E5EA",
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          height: tabHeight,
          paddingBottom: tabPaddingBottom,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="my-scans"
        options={{
          title: "My Scans",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="images-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    <Tabs.Screen
        name="scan-details"
        options={{
          href: null,
        }}
      />
    <Tabs.Screen
        name="notifications"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
