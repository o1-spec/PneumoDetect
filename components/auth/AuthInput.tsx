import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    View,
} from "react-native";

interface AuthInputProps extends TextInputProps {
  label?: string;
  icon?: string;
  error?: string;
  showPasswordToggle?: boolean;
  secureTextEntry?: boolean;
  onTogglePassword?: () => void;
  isPassword?: boolean;
}

/**
 * Premium auth input with label, icon, and error state
 */
export const AuthInput: React.FC<AuthInputProps> = ({
  label,
  icon,
  error,
  showPasswordToggle,
  onTogglePassword,
  isPassword,
  secureTextEntry,
  ...props
}) => {
  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={[styles.container, error && styles.containerError]}>
        {icon && (
          <Ionicons
            name={icon as any}
            size={18}
            color={error ? "#D32F2F" : "#6B7280"}
            style={styles.icon}
          />
        )}

        <TextInput
          style={styles.input}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={secureTextEntry}
          {...props}
        />

        {showPasswordToggle && isPassword && (
          <TouchableOpacity
            onPress={onTogglePassword}
            style={styles.toggleButton}
          >
            <Ionicons
              name={secureTextEntry ? "eye-off" : "eye"}
              size={18}
              color="#6B7280"
            />
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 50,
    backgroundColor: "#FFFFFF",
  },
  containerError: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
    fontWeight: "500",
  },
  toggleButton: {
    padding: 8,
    marginLeft: 4,
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: 6,
    fontWeight: "500",
  },
});
