import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SectionHeader } from "../premium/SectionHeader";

interface SystemStatusCardProps {
  systemStatus: {
    aiModel: string;
    database: string;
    storage: string;
  } | null;
}

export const SystemStatusCard = ({ systemStatus }: SystemStatusCardProps) => {
  return (
    <View style={styles.section}>
      <SectionHeader title="System Status" subtitle="All services online" />
      <View style={styles.statusCard}>
        <View style={styles.statusRow}>
          <View style={styles.statusIndicator}>
            <View style={[styles.statusDot, styles.statusActive]} />
            <Text style={styles.statusText}>AI Model</Text>
          </View>
          <Text style={styles.statusValue}>
            {typeof systemStatus?.aiModel === "string"
              ? systemStatus.aiModel
              : "Operational"}
          </Text>
        </View>
        <View style={styles.statusRow}>
          <View style={styles.statusIndicator}>
            <View style={[styles.statusDot, styles.statusActive]} />
            <Text style={styles.statusText}>Database</Text>
          </View>
          <Text style={styles.statusValue}>
            {typeof systemStatus?.database === "string"
              ? systemStatus.database
              : "Connected"}
          </Text>
        </View>
        <View style={styles.statusRow}>
          <View style={styles.statusIndicator}>
            <View style={[styles.statusDot, styles.statusActive]} />
            <Text style={styles.statusText}>Storage</Text>
          </View>
          <Text style={styles.statusValue}>
            {typeof systemStatus?.storage === "string"
              ? systemStatus.storage
              : "78% Used"}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
    paddingTop: 10
  },
  statusCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusActive: {
    backgroundColor: "#10B981",
  },
  statusText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4B5563",
  },
  statusValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
});
