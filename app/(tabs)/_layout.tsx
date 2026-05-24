import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import React from "react";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../hooks/useAuth";
import { PneumoLoader } from "../../components/premium";

export default function TabLayout() {
  const { user, isLoading, isSignedIn } = useAuth();
  const insets = useSafeAreaInsets();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FAFBFC" }}>
        <PneumoLoader size={64} />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="/" />;
  }

  if (user?.role === "PATIENT") {
    return <Redirect href="/(patient)" />;
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
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E5E5EA",
          height: tabHeight,
          paddingBottom: tabPaddingBottom,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
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
        name="scan"
        options={{
          title: "New Scan",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="lungs" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
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
        name="(admin)"
        options={{
          href: null, // Hide from tab bar
        }}
      />
    </Tabs>
  );
}
