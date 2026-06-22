import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/plus-jakarta-sans";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import "react-native-reanimated";
import { DialogContainer } from "../components/DialogContainer";
import { ToastContainer } from "../components/ToastContainer";
import { AuthProvider, useAuth } from "../hooks/useAuth";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Font loading completed, layout is ready

function AppContent() {
  const { user, isLoading, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const isRedirecting = React.useRef(false);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inPatientGroup = segments[0] === "(patient)";
    const inTabsGroup = segments[0] === "(tabs)";
    const inOnboardingGroup = segments[0] === "(onboarding)";
    
    // Top-level custom clinicians-only layout folders
    const inPatientsGroup = segments[0] === "patients";
    const inAnalysisGroup = segments[0] === "analysis";
    const inProfileGroup = segments[0] === "profile";
    const inNotificationsGroup = segments[0] === "notifications";
    const inReportGroup = segments[0] === "report";

    const inProtectedGroup = inPatientGroup || inTabsGroup || inOnboardingGroup || inPatientsGroup || inAnalysisGroup || inProfileGroup || inNotificationsGroup || inReportGroup;

    // Reset redirect lock once we have arrived at our correct target segment
    if (!isSignedIn) {
      if (segments.join("/") === "" || inAuthGroup) {
        isRedirecting.current = false;
      }
    } else {
      if (!user?.onboardingCompleted) {
        if (inOnboardingGroup) {
          isRedirecting.current = false;
        }
      } else {
        if (user?.role === "PATIENT") {
          if (inPatientGroup || inProfileGroup) {
            isRedirecting.current = false;
          }
        } else {
          if (inTabsGroup || inPatientsGroup || inAnalysisGroup || inProfileGroup || inNotificationsGroup || inReportGroup) {
            isRedirecting.current = false;
          }
        }
      }
    }

    if (!isSignedIn) {
      // If not signed in and in a protected group, redirect to login screen
      if (inProtectedGroup && !isRedirecting.current) {
        isRedirecting.current = true;
        router.replace("/(auth)/login");
      }
    } else {
      // If signed in:
      if (!user?.onboardingCompleted) {
        if (!inOnboardingGroup && !isRedirecting.current) {
          isRedirecting.current = true;
          router.replace("/(onboarding)");
        }
      } else {
        // If onboarding is completed, route based on role:
        if (user?.role === "PATIENT") {
          if (!inPatientGroup && !inProfileGroup && !isRedirecting.current) {
            isRedirecting.current = true;
            router.replace("/(patient)");
          }
        } else {
          // Clinician or Admin
          if (!inTabsGroup && !inPatientsGroup && !inAnalysisGroup && !inProfileGroup && !inNotificationsGroup && !inReportGroup && !isRedirecting.current) {
            isRedirecting.current = true;
            router.replace("/(tabs)");
          }
        }
      }
    }
  }, [isSignedIn, isLoading, segments.join("/"), user?.role, user?.onboardingCompleted]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(patient)" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  const splashHidden = React.useRef(false);

  useEffect(() => {
    if ((loaded || error) && !splashHidden.current) {
      splashHidden.current = true;
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <AuthProvider>
      <AppContent />
      <ToastContainer />
      <DialogContainer />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  defaultFont: {
    fontFamily: "PlusJakartaSans_500Medium",
  },
});
