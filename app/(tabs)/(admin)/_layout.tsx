import { Redirect, Stack } from "expo-router";
import React from "react";
import { View } from "react-native";
import { useAuth } from "../../../hooks/useAuth";
import { PneumoLoader } from "../../../components/premium";

export default function AdminLayout() {
  const { user, isLoading, isSignedIn } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F5F5F7" }}>
        <PneumoLoader size={64} />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="/" />;
  }

  if (user?.role !== "ADMIN") {
    return <Redirect href="/(tabs)" />;
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
