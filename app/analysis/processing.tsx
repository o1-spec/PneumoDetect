import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { scansAPI } from "../../services/api.client";
import { getErrorMessage } from "../../utils/errorHandler";

export default function ProcessingScreen() {
  const params = useLocalSearchParams();
  const { scanId } = params;
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Initializing...");
  const [error, setError] = useState<string | null>(null);
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
      ]),
    ).start();

    // Start processing the scan
    processScan();
  }, []);

  const processScan = async () => {
    try {
      setStatusText("Starting AI analysis...");
      setProgress(10);

      // Call the backend to process the scan
      const processedScan = await scansAPI.process(scanId as string);

      // Poll for completion
      let polling = true;
      let pollCount = 0;
      const maxPolls = 30; // Max 30 polls (5 minutes with 10s interval)

      while (polling && pollCount < maxPolls) {
        // Update progress based on status
        if (processedScan.status === "PROCESSING") {
          setProgress(Math.min(80, 10 + pollCount * 2));
          setStatusText("AI model running...");
        } else if (processedScan.status === "COMPLETED") {
          setProgress(100);
          setStatusText("Analysis complete!");
          polling = false;

          // Navigate to results
          setTimeout(() => {
            router.replace({
              pathname: "/analysis/results/[scanId]",
              params: {
                scanId: processedScan.id,
                imageUri: processedScan.imageUrl,
                result: processedScan.result,
                confidence: String(processedScan.confidence || 0),
                heatmapUrl: processedScan.heatmapUrl,
              },
            });
          }, 500);
        } else if (processedScan.status === "FAILED") {
          throw new Error("Processing failed. Please try again.");
        }

        if (polling) {
          // Wait before polling again
          await new Promise((resolve) => setTimeout(resolve, 2000));
          pollCount++;
        }
      }

      if (polling) {
        throw new Error("Processing timeout. Please try again.");
      }
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      setStatusText("Error processing scan");
      setProgress(0);
    }
  };

  return (
    <View style={styles.container}>
      {error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color="#D32F2F" />
          <Text style={styles.errorTitle}>Processing Error</Text>
          <Text style={styles.errorMessage}>{error}</Text>
        </View>
      ) : (
        <View style={styles.content}>
          <Animated.View
            style={[
              styles.iconContainer,
              { transform: [{ scale: pulseAnim }] },
            ]}
          >
            <Ionicons name="analytics" size={80} color="#0066CC" />
          </Animated.View>

          <Text style={styles.title}>Analyzing X-Ray</Text>
          <Text style={styles.subtitle}>
            Please wait while our AI processes the image
          </Text>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{progress}%</Text>
          </View>

          <View style={styles.statusContainer}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>{statusText}</Text>
          </View>

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
      )}
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#F5F5F7",
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#D32F2F",
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: "#636366",
    textAlign: "center",
    marginTop: 8,
  },
});
