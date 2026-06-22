import { Stack } from "expo-router";
import React from "react";
import { View } from "react-native";
import { useAuth } from "../../../hooks/useAuth";
import { PneumoLoader } from "../../../components/premium";
import { COLORS } from "../../../constants/Theme";

export default function AdminLayout() {
  const { user, isLoading, isSignedIn } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.background }}>
        <PneumoLoader size={64} />
      </View>
    );
  }



  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="users" />
      <Stack.Screen name="all-scans" />
      <Stack.Screen name="analytics" />
    </Stack>
  );
}
