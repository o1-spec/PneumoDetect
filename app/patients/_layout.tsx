import { Redirect, Stack } from "expo-router";
import React from "react";
import { View } from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { PneumoLoader } from "../../components/premium";

export default function PatientsLayout() {
  const { user, isLoading, isSignedIn } = useAuth();

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
