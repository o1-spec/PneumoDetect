import React, { ReactNode } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableOpacityProps,
} from "react-native";

interface PremiumButtonProps extends TouchableOpacityProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
}

/**
 * Premium button component with multiple variants
 */
export const PremiumButton: React.FC<PremiumButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon,
  style,
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        styles[`size_${size}`],
        isDisabled && styles.disabled,
        style,
      ]}
      disabled={isDisabled}
      activeOpacity={isDisabled ? 1 : 0.85}
      {...props}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === "primary" ? "#FFFFFF" : "#0B5ED7"}
          style={{ marginRight: 8 }}
        />
      )}
      {!loading && icon && <>{icon}</>}
      {typeof children === "string" ? (
        <Text
          style={[
            styles.text,
            styles[`text_${variant}`],
            styles[`textSize_${size}`],
            { marginLeft: icon ? 8 : 0 },
          ]}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    fontWeight: "600",
  },

  /* Variants */
  primary: {
    backgroundColor: "#0B5ED7",
    shadowColor: "#0B5ED7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  secondary: {
    backgroundColor: "#E0E7FF",
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#0B5ED7",
  },

  /* Sizes */
  size_sm: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  size_md: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    minHeight: 50,
  },
  size_lg: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    minHeight: 56,
  },

  /* Text variants */
  text: {
    fontWeight: "600",
    textAlign: "center",
  },
  text_primary: {
    color: "#FFFFFF",
  },
  text_secondary: {
    color: "#0B5ED7",
  },
  text_outline: {
    color: "#0B5ED7",
  },

  /* Text sizes */
  textSize_sm: {
    fontSize: 13,
  },
  textSize_md: {
    fontSize: 15,
  },
  textSize_lg: {
    fontSize: 16,
  },

  /* Disabled state */
  disabled: {
    opacity: 0.5,
  },
});
