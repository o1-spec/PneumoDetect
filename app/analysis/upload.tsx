import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function UploadScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please grant camera roll permissions to upload X-ray images.",
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please grant camera permissions to take photos.",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleContinue = () => {
    if (!selectedImage) {
      Alert.alert("No Image", "Please select an X-ray image first.");
      return;
    }

    router.push({
      pathname: "/analysis/patient-info",
      params: { imageUri: selectedImage },
    });
  };

  const handleBack = () => {
    router.push("/(tabs)");
  };

  return (
    <View style={styles.container}>
      {/* Enhanced Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#0066CC" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Upload X-Ray</Text>
            <Text style={styles.headerSubtitle}>Step 1 of 3</Text>
          </View>
          <View style={styles.headerIcon}>
            <Ionicons name="cloud-upload-outline" size={24} color="#0066CC" />
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Instructions */}
        <View style={styles.instructionsCard}>
          <View style={styles.instructionsHeader}>
            <Ionicons name="information-circle" size={24} color="#0066CC" />
            <Text style={styles.instructionsTitle}>Upload Guidelines</Text>
          </View>
          <View style={styles.guidelinesList}>
            <View style={styles.guidelineItem}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.instructionsText}>
                Upload a clear chest X-ray image
              </Text>
            </View>
            <View style={styles.guidelineItem}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.instructionsText}>
                Accepted formats: JPG, PNG
              </Text>
            </View>
            <View style={styles.guidelineItem}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.instructionsText}>
                Ensure good lighting and clarity
              </Text>
            </View>
            <View style={styles.guidelineItem}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.instructionsText}>
                Image should show full chest area
              </Text>
            </View>
          </View>
        </View>

        {/* Image Preview */}
        <View style={styles.previewCard}>
          {selectedImage ? (
            <View style={styles.imagePreviewContainer}>
              <Image
                source={{ uri: selectedImage }}
                style={styles.previewImage}
              />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => setSelectedImage(null)}
              >
                <Ionicons name="close-circle" size={32} color="#D32F2F" />
              </TouchableOpacity>
              <View style={styles.imageStatusBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                <Text style={styles.imageStatusText}>Image Ready</Text>
              </View>
            </View>
          ) : (
            <View style={styles.placeholderContainer}>
              <View style={styles.placeholderIcon}>
                <Ionicons name="image-outline" size={64} color="#C7C7CC" />
              </View>
              <Text style={styles.placeholderTitle}>No image selected</Text>
              <Text style={styles.placeholderSubtext}>
                Choose from gallery or take a photo
              </Text>
            </View>
          )}
        </View>

        {/* Upload Options */}
        <View style={styles.uploadOptions}>
          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <Ionicons name="folder-open-outline" size={24} color="#FFFFFF" />
            <View style={styles.buttonTextContainer}>
              <Text style={styles.uploadButtonText}>Choose from Gallery</Text>
              <Text style={styles.uploadButtonSubtext}>Browse your files</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.uploadButton, styles.cameraButton]}
            onPress={takePhoto}
          >
            <Ionicons name="camera-outline" size={24} color="#0066CC" />
            <View style={styles.buttonTextContainer}>
              <Text style={styles.cameraButtonText}>Take Photo</Text>
              <Text style={styles.cameraButtonSubtext}>Use device camera</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Sample Images Info */}
        <View style={styles.sampleCard}>
          <View style={styles.sampleHeader}>
            <Text style={styles.sampleIcon}>📷</Text>
            <Text style={styles.sampleTitle}>Demo Mode</Text>
          </View>
          <Text style={styles.sampleText}>
            For demo purposes, any chest X-ray image can be used. The AI will
            simulate a realistic diagnosis based on the uploaded image.
          </Text>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedImage && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!selectedImage}
        >
          <Text style={styles.continueButtonText}>
            Continue to Patient Info
          </Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
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
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  instructionsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E3F2FD",
  },
  instructionsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  guidelinesList: {
    gap: 10,
  },
  guidelineItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: "#636366",
    lineHeight: 20,
    flex: 1,
  },
  previewCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    minHeight: 300,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  imagePreviewContainer: {
    width: "100%",
    position: "relative",
  },
  previewImage: {
    width: "100%",
    height: 300,
    borderRadius: 8,
    backgroundColor: "#F5F5F7",
  },
  removeButton: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  imageStatusBadge: {
    position: "absolute",
    bottom: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageStatusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4CAF50",
  },
  placeholderContainer: {
    alignItems: "center",
  },
  placeholderIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F5F5F7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  placeholderTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: "#8E8E93",
  },
  uploadOptions: {
    gap: 12,
    marginBottom: 20,
  },
  uploadButton: {
    flexDirection: "row",
    backgroundColor: "#0066CC",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    gap: 12,
    shadowColor: "#0066CC",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonTextContainer: {
    flex: 1,
  },
  uploadButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  uploadButtonSubtext: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    marginTop: 2,
  },
  cameraButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#0066CC",
    shadowColor: "#000",
    shadowOpacity: 0.1,
  },
  cameraButtonText: {
    color: "#0066CC",
    fontSize: 16,
    fontWeight: "bold",
  },
  cameraButtonSubtext: {
    color: "#8E8E93",
    fontSize: 12,
    marginTop: 2,
  },
  sampleCard: {
    backgroundColor: "#FFF3CD",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FFE69C",
  },
  sampleHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  sampleIcon: {
    fontSize: 20,
  },
  sampleTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#856404",
  },
  sampleText: {
    fontSize: 13,
    color: "#856404",
    lineHeight: 20,
  },
  continueButton: {
    flexDirection: "row",
    backgroundColor: "#0066CC",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#0066CC",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonDisabled: {
    opacity: 0.4,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
