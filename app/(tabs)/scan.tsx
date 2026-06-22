import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { router } from "expo-router";
import { PneumoLoader } from "../../components/premium";
import { COLORS } from "../../constants/Theme";

export default function ScanScreen() {
  useEffect(() => {
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
    backgroundColor: COLORS.background,
  },
});