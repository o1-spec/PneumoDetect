import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { router } from "expo-router";
import { PneumoLoader } from "../../components/premium";

export default function ScanScreen() {
  useEffect(() => {
    // Redirect to upload screen
    router.replace("/analysis/upload");
  }, []);

  return (
    <View style={styles.container}>
      <PneumoLoader size={64} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F7",
  },
});