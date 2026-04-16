import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface InfoRowProps {
  label: string;
  value: string;
}

export const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  infoLabel: {
    fontSize: 14,
    color: "#8E8E93",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
});
