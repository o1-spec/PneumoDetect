import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
}

/**
 * Premium auth screen header with icon and messaging
 */
export const AuthHeader: React.FC<AuthHeaderProps> = ({
  title,
  subtitle,
  icon,
}) => {
  return (
    <View style={styles.container}>
      {icon && (
        <View style={styles.iconWrapper}>
          <View style={styles.iconBackground}>
            <Ionicons name={icon as any} size={32} color="#0B5ED7" />
          </View>
        </View>
      )}

      <Text style={styles.title}>{title}</Text>

      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconWrapper: {
    marginBottom: 24,
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F0F4FF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E0E7FF",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 280,
  },
});
