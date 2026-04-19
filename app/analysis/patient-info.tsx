import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { patientsAPI, scansAPI } from "../../services/api.client";
import { Patient } from "../../types/api";
import { getErrorMessage } from "../../utils/errorHandler";

export default function PatientInfoScreen() {
  const { imageUri } = useLocalSearchParams();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState<"MALE" | "FEMALE" | "">("");

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const data = await patientsAPI.getAll();
      setPatients(data);
    } catch (err) {
      Alert.alert("Error", getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setPatientId(patient.id);
    setPatientName(patient.name);
    setAge(String(patient.age));
    setSex(patient.gender === "MALE" ? "MALE" : "FEMALE");
    setShowPatientDropdown(false);
  };

  const handleCreatePatient = async () => {
    if (!patientId || !patientName || !age || !sex) {
      Alert.alert("Missing Information", "Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      const newPatient = await patientsAPI.create({
        idNumber: patientId,
        name: patientName,
        age: parseInt(age),
        gender: sex as "MALE" | "FEMALE",
      });
      setSelectedPatient(newPatient);
      setPatients([...patients, newPatient]);
    } catch (err) {
      Alert.alert("Error", getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleUploadScan = async () => {
    if (!selectedPatient) {
      Alert.alert("Select Patient", "Please select or create a patient first.");
      return;
    }

    try {
      setUploading(true);
      // Upload the scan image
      const scan = await scansAPI.upload(
        selectedPatient.id,
        imageUri as string,
      );

      // Navigate to processing screen with the scan ID
      router.replace({
        pathname: "/analysis/processing",
        params: {
          scanId: scan.id,
        },
      });
    } catch (err) {
      Alert.alert("Upload Error", getErrorMessage(err));
    } finally {
      setUploading(false);
    }
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
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, !selectedPatient && styles.tabActive]}
            onPress={() => {
              setSelectedPatient(null);
              setPatientId("");
              setPatientName("");
              setAge("");
              setSex("");
            }}
          >
            <Text
              style={[styles.tabText, !selectedPatient && styles.tabTextActive]}
            >
              New Patient
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, selectedPatient && styles.tabActive]}
            onPress={() => setShowPatientDropdown(true)}
          >
            <Text
              style={[styles.tabText, selectedPatient && styles.tabTextActive]}
            >
              Existing Patient
            </Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={showPatientDropdown}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowPatientDropdown(false)}
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowPatientDropdown(false)}>
              <Text style={styles.modalClose}>Close</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Patient</Text>
            <View style={{ width: 50 }} />
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0066CC" />
            </View>
          ) : (
            <FlatList
              data={patients}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.patientItem}
                  onPress={() => handleSelectPatient(item)}
                >
                  <View style={styles.patientInfo}>
                    <Text style={styles.patientName}>{item.name}</Text>
                    <Text style={styles.patientDetails}>
                      ID: {item.idNumber} • Age: {item.age} • {item.gender}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color="#8E8E93" />
                </TouchableOpacity>
              )}
            />
          )}
        </Modal>

        <View style={styles.infoCard}>
          <Ionicons name="document-text" size={24} color="#0066CC" />
          <Text style={styles.infoText}>
            {selectedPatient
              ? "Scan will be associated with " + selectedPatient.name
              : "Please provide patient details"}
          </Text>
        </View>

        <View style={styles.form}>
          {selectedPatient ? (
            // Display selected patient info
            <>
              <View style={styles.selectedPatientCard}>
                <View style={styles.selectedPatientHeader}>
                  <Ionicons name="person-circle" size={40} color="#0066CC" />
                  <View style={styles.selectedPatientText}>
                    <Text style={styles.selectedPatientName}>
                      {selectedPatient.name}
                    </Text>
                    <Text style={styles.selectedPatientDetails}>
                      ID: {selectedPatient.idNumber}
                    </Text>
                  </View>
                </View>
                <View style={styles.selectedPatientStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Age</Text>
                    <Text style={styles.statValue}>{selectedPatient.age}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Gender</Text>
                    <Text style={styles.statValue}>
                      {selectedPatient.gender === "MALE" ? "M" : "F"}
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Total Scans</Text>
                    <Text style={styles.statValue}>
                      {selectedPatient.scans?.length || 0}
                    </Text>
                  </View>
                </View>
              </View>
            </>
          ) : (
            // New patient form
            <>
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

              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Sex <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.sexButtons}>
                  <TouchableOpacity
                    style={[
                      styles.sexButton,
                      sex === "MALE" && styles.sexButtonActive,
                    ]}
                    onPress={() => setSex("MALE")}
                  >
                    <Ionicons
                      name="male"
                      size={20}
                      color={sex === "MALE" ? "#FFFFFF" : "#0066CC"}
                    />
                    <Text
                      style={[
                        styles.sexButtonText,
                        sex === "MALE" && styles.sexButtonTextActive,
                      ]}
                    >
                      Male
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.sexButton,
                      sex === "FEMALE" && styles.sexButtonActive,
                    ]}
                    onPress={() => setSex("FEMALE")}
                  >
                    <Ionicons
                      name="female"
                      size={20}
                      color={sex === "FEMALE" ? "#FFFFFF" : "#0066CC"}
                    />
                    <Text
                      style={[
                        styles.sexButtonText,
                        sex === "FEMALE" && styles.sexButtonTextActive,
                      ]}
                    >
                      Female
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {(patientId || patientName || age || sex) && !selectedPatient && (
                <TouchableOpacity
                  style={styles.createButton}
                  onPress={handleCreatePatient}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <Ionicons name="person-add" size={20} color="#FFFFFF" />
                      <Text style={styles.createButtonText}>
                        Create Patient
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        {selectedPatient && (
          <TouchableOpacity
            style={styles.analyzeButton}
            onPress={handleUploadScan}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="cloud-upload" size={20} color="#FFFFFF" />
                <Text style={styles.analyzeButtonText}>Upload & Analyze</Text>
              </>
            )}
          </TouchableOpacity>
        )}
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
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    alignItems: "center",
  },
  tabActive: {
    borderBottomColor: "#0066CC",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8E8E93",
  },
  tabTextActive: {
    color: "#0066CC",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  modalClose: {
    fontSize: 16,
    color: "#0066CC",
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  patientItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F7",
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  patientDetails: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 4,
  },
  selectedPatientCard: {
    backgroundColor: "#E3F2FD",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  selectedPatientHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  selectedPatientText: {
    flex: 1,
  },
  selectedPatientName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  selectedPatientDetails: {
    fontSize: 12,
    color: "#636366",
    marginTop: 4,
  },
  selectedPatientStats: {
    flexDirection: "row",
    gap: 12,
  },
  statItem: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    color: "#8E8E93",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0066CC",
    marginTop: 4,
  },
  createButton: {
    flexDirection: "row",
    backgroundColor: "#34C759",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginBottom: 12,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
