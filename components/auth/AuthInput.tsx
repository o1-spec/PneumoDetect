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
import { COLORS, BORDER_RADIUS } from "../../constants/Theme";

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
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={[
        styles.container, 
        error ? styles.containerError : (isFocused && styles.containerFocused)
      ]}>
        {icon && (
          <Ionicons
            name={icon as any}
            size={18}
            color={error ? COLORS.danger : (isFocused ? COLORS.primary : COLORS.icon)}
            style={styles.icon}
          />
        )}

        <TextInput
          style={styles.input}
          placeholderTextColor={COLORS.textTertiary}
          secureTextEntry={secureTextEntry}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
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
              color={COLORS.textTertiary}
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
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: 14,
    height: 50,
    backgroundColor: COLORS.card,
  },
  containerFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.card,
  },
  containerError: {
    borderColor: COLORS.danger,
    backgroundColor: COLORS.dangerLight,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: "500",
  },
  toggleButton: {
    padding: 8,
    marginLeft: 4,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.danger,
    marginTop: 6,
    fontWeight: "500",
  },
});
