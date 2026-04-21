import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface PremiumChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  icon?: string;
}

export const PremiumChip: React.FC<PremiumChipProps> = ({
  label,
  selected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.chip, selected ? styles.chipActive : styles.chipInactive]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.chipText,
          selected ? styles.chipTextActive : styles.chipTextInactive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    marginRight: 8,
    marginBottom: 8,
  },
  chipActive: {
    backgroundColor: "#0B5ED7",
    borderColor: "#0B5ED7",
  },
  chipInactive: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
  },
  chipTextActive: {
    color: "#FFFFFF",
  },
  chipTextInactive: {
    color: "#6B7280",
  },
});
