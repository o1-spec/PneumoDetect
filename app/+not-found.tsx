import { Link, Stack } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops! Page Not Found" }} />
      <View style={styles.container}>
        {/* 404 Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="alert-circle-outline" size={120} color="#0066CC" />
        </View>

        {/* Error Code */}
        <Text style={styles.errorCode}>404</Text>

        {/* Error Message */}
        <Text style={styles.title}>Page Not Found</Text>
        <Text style={styles.description}>
          The page you're looking for doesn't exist or has been moved.
        </Text>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Link href="/(tabs)" asChild>
            <TouchableOpacity style={styles.primaryButton}>
              <Ionicons name="home" size={20} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>Go to Dashboard</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/analysis/upload" asChild>
            <TouchableOpacity style={styles.secondaryButton}>
              <Ionicons name="add-circle-outline" size={20} color="#0066CC" />
              <Text style={styles.secondaryButtonText}>New Scan</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Help Text */}
        <View style={styles.helpContainer}>
          <Ionicons name="information-circle" size={16} color="#8E8E93" />
          <Text style={styles.helpText}>
            If you believe this is an error, please contact support
          </Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F7",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  iconContainer: {
    marginBottom: 24,
  },
  errorCode: {
    fontSize: 72,
    fontWeight: "bold",
    color: "#0066CC",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
    marginBottom: 32,
  },
  primaryButton: {
    flexDirection: "row",
    backgroundColor: "#0066CC",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 2,
    borderColor: "#0066CC",
  },
  secondaryButtonText: {
    color: "#0066CC",
    fontSize: 16,
    fontWeight: "bold",
  },
  helpContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  helpText: {
    fontSize: 13,
    color: "#8E8E93",
  },
});