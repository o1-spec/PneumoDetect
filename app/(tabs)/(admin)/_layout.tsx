import { Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";
import { useAuth } from "../../../hooks/useAuth";
import { PneumoLoader } from "../../../components/premium";

export default function AdminLayout() {
  const { user, isLoading, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isSignedIn || user?.role !== "ADMIN") {
        router.replace("/(tabs)");
      }
    }
  }, [user, isLoading, isSignedIn]);

  if (isLoading || !isSignedIn || user?.role !== "ADMIN") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F5F5F7" }}>
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
