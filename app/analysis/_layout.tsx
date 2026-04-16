import { Stack } from "expo-router";

export default function AnalysisLayout() {
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
