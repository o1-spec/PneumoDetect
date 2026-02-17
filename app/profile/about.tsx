import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const TEAM_MEMBERS = [
  {
    name: "Dr. Emily Chen",
    role: "Chief Medical Officer",
    icon: "medical",
    color: "#4CAF50",
  },
  {
    name: "Dr. Michael Rodriguez",
    role: "AI Research Lead",
    icon: "flask",
    color: "#0066CC",
  },
  {
    name: "Sarah Johnson",
    role: "Product Manager",
    icon: "briefcase",
    color: "#FF9800",
  },
  {
    name: "David Kim",
    role: "Lead Developer",
    icon: "code-slash",
    color: "#9C27B0",
  },
];

const FEATURES = [
  {
    icon: "flash",
    title: "Fast Analysis",
    description: "Get results in seconds with our advanced AI model",
  },
  {
    icon: "shield-checkmark",
    title: "HIPAA Compliant",
    description: "Your data is secure and meets healthcare standards",
  },
  {
    icon: "analytics",
    title: "94.5% Accuracy",
    description: "Trained on thousands of validated chest X-rays",
  },
  {
    icon: "people",
    title: "Team Collaboration",
    description: "Share and review scans with your medical team",
  },
];

export default function AboutScreen() {
  const handlePrivacyPolicy = () => {
    Linking.openURL("https://pneumoscan.ai/privacy");
  };

  const handleTerms = () => {
    Linking.openURL("https://pneumoscan.ai/terms");
  };

  const handleLicense = () => {
    Linking.openURL("https://pneumoscan.ai/license");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#0066CC" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>About</Text>
            <Text style={styles.headerSubtitle}>PneumoScan AI</Text>
          </View>
          <View style={styles.placeholder} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* App Info */}
        <View style={styles.appInfoSection}>
          <View style={styles.appIcon}>
            <Ionicons name="medical" size={48} color="#0066CC" />
          </View>
          <Text style={styles.appName}>PneumoScan AI</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.appTagline}>
            AI-Powered Pneumonia Detection System
          </Text>
        </View>

        {/* Mission Statement */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <View style={styles.card}>
            <Text style={styles.missionText}>
              PneumoScan AI is dedicated to revolutionizing pneumonia diagnosis
              through cutting-edge artificial intelligence. Our mission is to
              provide healthcare professionals with fast, accurate, and reliable
              diagnostic tools to improve patient outcomes worldwide.
            </Text>
          </View>
        </View>

        {/* Key Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          <View style={styles.card}>
            {FEATURES.map((feature, index) => (
              <View
                key={index}
                style={[
                  styles.featureItem,
                  index === FEATURES.length - 1 && styles.lastItem,
                ]}
              >
                <View style={styles.featureIcon}>
                  <Ionicons
                    name={feature.icon as any}
                    size={24}
                    color="#0066CC"
                  />
                </View>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>
                    {feature.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Team */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Team</Text>
          <View style={styles.teamGrid}>
            {TEAM_MEMBERS.map((member, index) => (
              <View key={index} style={styles.teamCard}>
                <View
                  style={[
                    styles.teamIcon,
                    { backgroundColor: `${member.color}15` },
                  ]}
                >
                  <Ionicons
                    name={member.icon as any}
                    size={28}
                    color={member.color}
                  />
                </View>
                <Text style={styles.teamName}>{member.name}</Text>
                <Text style={styles.teamRole}>{member.role}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Impact</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>10,000+</Text>
              <Text style={styles.statLabel}>Scans Analyzed</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>94.5%</Text>
              <Text style={styles.statLabel}>Accuracy Rate</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>500+</Text>
              <Text style={styles.statLabel}>Healthcare Providers</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>50+</Text>
              <Text style={styles.statLabel}>Countries Served</Text>
            </View>
          </View>
        </View>

        {/* Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal & Compliance</Text>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.legalItem}
              onPress={handlePrivacyPolicy}
            >
              <Ionicons name="document-text-outline" size={20} color="#0066CC" />
              <Text style={styles.legalText}>Privacy Policy</Text>
              <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.legalItem} onPress={handleTerms}>
              <Ionicons name="shield-outline" size={20} color="#0066CC" />
              <Text style={styles.legalText}>Terms of Service</Text>
              <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.legalItem} onPress={handleLicense}>
              <Ionicons name="key-outline" size={20} color="#0066CC" />
              <Text style={styles.legalText}>Open Source Licenses</Text>
              <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Copyright */}
        <View style={styles.copyright}>
          <Text style={styles.copyrightText}>
            © 2024 PneumoScan AI. All rights reserved.
          </Text>
          <Text style={styles.copyrightSubtext}>
            Made with ❤️ for healthcare professionals
          </Text>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F7",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F7",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTextContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 2,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  appInfoSection: {
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingVertical: 40,
    marginBottom: 24,
  },
  appIcon: {
    width: 100,
    height: 100,
    borderRadius: 24,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 8,
  },
  appTagline: {
    fontSize: 14,
    color: "#636366",
    textAlign: "center",
    paddingHorizontal: 32,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8E8E93",
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  missionText: {
    fontSize: 15,
    color: "#636366",
    lineHeight: 24,
    textAlign: "justify",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F7",
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  featureText: {
    flex: 1,
    paddingTop: 4,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: "#8E8E93",
    lineHeight: 20,
  },
  teamGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  teamCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  teamIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  teamName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1C1C1E",
    textAlign: "center",
    marginBottom: 4,
  },
  teamRole: {
    fontSize: 12,
    color: "#8E8E93",
    textAlign: "center",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0066CC",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#8E8E93",
    textAlign: "center",
  },
  legalItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F7",
  },
  legalText: {
    flex: 1,
    fontSize: 15,
    color: "#1C1C1E",
  },
  copyright: {
    alignItems: "center",
    paddingVertical: 24,
  },
  copyrightText: {
    fontSize: 13,
    color: "#8E8E93",
    marginBottom: 4,
  },
  copyrightSubtext: {
    fontSize: 12,
    color: "#C7C7CC",
  },
  bottomSpacer: {
    height: 40,
  },
});