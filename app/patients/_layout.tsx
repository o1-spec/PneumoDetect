import { Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { PneumoLoader } from "../../components/premium";

export default function PatientsLayout() {
  const { user, isLoading, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isSignedIn) {
        router.replace("/");
      } else if (user?.role === "PATIENT") {
        router.replace("/(patient)");
      }
    }
  }, [user, isLoading, isSignedIn]);

  if (isLoading || !isSignedIn || user?.role === "PATIENT") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FAFBFC" }}>
        <PneumoLoader size={64} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="create" />
      <Stack.Screen name="[patientId]" />
    </Stack>
  );
}
