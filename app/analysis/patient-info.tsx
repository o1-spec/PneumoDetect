import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function PatientInfoScreen() {
  const { imageUri } = useLocalSearchParams();
  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState<"Male" | "Female" | "">("");
  const [scanDate, setScanDate] = useState(new Date().toISOString().split("T")[0]);

  const handleAnalyze = () => {
    if (!patientId || !patientName || !age || !sex) {
      Alert.alert("Missing Information", "Please fill in all required fields.");
      return;
    }

    // Navigate to processing screen with all data
    router.push({
      pathname: "/analysis/processing",
      params: {
        imageUri,
        patientId,
        patientName,
        age,
        sex,
        scanDate,
      },
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#0066CC" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Patient Information</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="document-text" size={24} color="#0066CC" />
          <Text style={styles.infoText}>
            Please provide patient details for accurate record keeping
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Patient ID */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Patient ID <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="finger-print"
                size={20}
                color="#8E8E93"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="e.g., PT-12345"
                placeholderTextColor="#C7C7CC"
                value={patientId}
                onChangeText={setPatientId}
                autoCapitalize="characters"
              />
            </View>
          </View>

          {/* Patient Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Full Name <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="person"
                size={20}
                color="#8E8E93"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="e.g., John Doe"
                placeholderTextColor="#C7C7CC"
                value={patientName}
                onChangeText={setPatientName}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Age */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Age <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="calendar"
                size={20}
                color="#8E8E93"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="e.g., 45"
                placeholderTextColor="#C7C7CC"
                value={age}
                onChangeText={setAge}
                keyboardType="number-pad"
                maxLength={3}
              />
            </View>
          </View>

          {/* Sex */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Sex <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.sexButtons}>
              <TouchableOpacity
                style={[
                  styles.sexButton,
                  sex === "Male" && styles.sexButtonActive,
                ]}
                onPress={() => setSex("Male")}
              >
                <Ionicons
                  name="male"
                  size={20}
                  color={sex === "Male" ? "#FFFFFF" : "#0066CC"}
                />
                <Text
                  style={[
                    styles.sexButtonText,
                    sex === "Male" && styles.sexButtonTextActive,
                  ]}
                >
                  Male
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.sexButton,
                  sex === "Female" && styles.sexButtonActive,
                ]}
                onPress={() => setSex("Female")}
              >
                <Ionicons
                  name="female"
                  size={20}
                  color={sex === "Female" ? "#FFFFFF" : "#0066CC"}
                />
                <Text
                  style={[
                    styles.sexButtonText,
                    sex === "Female" && styles.sexButtonTextActive,
                  ]}
                >
                  Female
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Scan Date */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Scan Date</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color="#8E8E93"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#C7C7CC"
                value={scanDate}
                onChangeText={setScanDate}
              />
            </View>
          </View>
        </View>

        {/* Analyze Button */}
        <TouchableOpacity style={styles.analyzeButton} onPress={handleAnalyze}>
          <Ionicons name="analytics" size={20} color="#FFFFFF" />
          <Text style={styles.analyzeButtonText}>Analyze X-Ray</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#E3F2FD",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 12,
    alignItems: "center",
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#0066CC",
    lineHeight: 20,
  },
  form: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  required: {
    color: "#D32F2F",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F7",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1C1C1E",
  },
  sexButtons: {
    flexDirection: "row",
    gap: 12,
  },
  sexButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F7",
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  sexButtonActive: {
    backgroundColor: "#0066CC",
    borderColor: "#0066CC",
  },
  sexButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0066CC",
  },
  sexButtonTextActive: {
    color: "#FFFFFF",
  },
  analyzeButton: {
    flexDirection: "row",
    backgroundColor: "#0066CC",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  analyzeButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});