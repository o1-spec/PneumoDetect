import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ProcessingScreen() {
  const params = useLocalSearchParams();
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Initializing...");
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Simulate AI processing steps
    const steps = [
      { delay: 500, progress: 20, text: "Loading X-ray image..." },
      { delay: 1500, progress: 40, text: "Preprocessing image data..." },
      { delay: 2500, progress: 60, text: "Running AI model..." },
      { delay: 3500, progress: 80, text: "Analyzing patterns..." },
      { delay: 4500, progress: 95, text: "Generating heatmap..." },
      { delay: 5500, progress: 100, text: "Complete!" },
    ];

    steps.forEach((step) => {
      setTimeout(() => {
        setProgress(step.progress);
        setStatusText(step.text);
      }, step.delay);
    });

    // Navigate to results after processing
    setTimeout(() => {
      // Generate random diagnosis for demo
      const isPneumonia = Math.random() > 0.5;
      const confidence = isPneumonia
        ? 85 + Math.random() * 14 // 85-99%
        : 70 + Math.random() * 25; // 70-95%

      router.replace({
        pathname: "/analysis/results/[scanId]",
        params: {
          ...params,
          scanId: `SCAN-${Date.now()}`,
          prediction: isPneumonia ? "Pneumonia Detected" : "Normal",
          confidence: confidence.toFixed(1),
        },
      });
    }, 6000);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Animated Icon */}
        <Animated.View
          style={[styles.iconContainer, { transform: [{ scale: pulseAnim }] }]}
        >
          <Ionicons name="analytics" size={80} color="#0066CC" />
        </Animated.View>

        <Text style={styles.title}>Analyzing X-Ray</Text>
        <Text style={styles.subtitle}>Please wait while our AI processes the image</Text>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{progress}%</Text>
        </View>

        {/* Status Text */}
        <View style={styles.statusContainer}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>{statusText}</Text>
        </View>

        {/* Steps */}
        <View style={styles.stepsContainer}>
          <StepItem
            icon="image-outline"
            label="Image Upload"
            completed={progress >= 20}
          />
          <StepItem
            icon="construct-outline"
            label="Preprocessing"
            completed={progress >= 40}
          />
          <StepItem
            icon="brain-outline"
            label="AI Analysis"
            completed={progress >= 60}
          />
          <StepItem
            icon="analytics-outline"
            label="Pattern Detection"
            completed={progress >= 80}
          />
          <StepItem
            icon="color-palette-outline"
            label="Heatmap"
            completed={progress >= 95}
          />
        </View>
      </View>
    </View>
  );
}

const StepItem = ({
  icon,
  label,
  completed,
}: {
  icon: any;
  label: string;
  completed: boolean;
}) => (
  <View style={styles.stepItem}>
    <View
      style={[
        styles.stepIcon,
        completed ? styles.stepIconCompleted : styles.stepIconPending,
      ]}
    >
      <Ionicons
        name={completed ? "checkmark" : icon}
        size={16}
        color={completed ? "#FFFFFF" : "#C7C7CC"}
      />
    </View>
    <Text style={[styles.stepLabel, completed && styles.stepLabelCompleted]}>
      {label}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F7",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
    marginBottom: 40,
  },
  progressContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 32,
  },
  progressBar: {
    width: "100%",
    height: 8,
    backgroundColor: "#E5E5EA",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#0066CC",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0066CC",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 40,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#0066CC",
  },
  statusText: {
    fontSize: 14,
    color: "#636366",
    fontWeight: "600",
  },
  stepsContainer: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    gap: 16,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  stepIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  stepIconCompleted: {
    backgroundColor: "#4CAF50",
  },
  stepIconPending: {
    backgroundColor: "#F5F5F7",
    borderWidth: 2,
    borderColor: "#E5E5EA",
  },
  stepLabel: {
    fontSize: 14,
    color: "#C7C7CC",
  },
  stepLabelCompleted: {
    color: "#1C1C1E",
    fontWeight: "600",
  },
});