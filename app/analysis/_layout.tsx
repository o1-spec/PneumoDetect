import { Stack } from "expo-router";
import React from "react";
import { View } from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { PneumoLoader } from "../../components/premium";

export default function AnalysisLayout() {
  const { user, isLoading, isSignedIn } = useAuth();

  if (isLoading) {
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
      <Stack.Screen name="upload" />
      <Stack.Screen name="patient-info" />
      <Stack.Screen name="processing" />
      <Stack.Screen name="results/[scanId]" />
      <Stack.Screen name="results/explainable" />
    </Stack>
  );
}
