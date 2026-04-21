import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Card } from "../../components/premium";
import { useToast } from "../../hooks/useToast";

export default function UploadScreen() {
  const { warning, error: showError, info } = useToast();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      warning("Permission required to access photos");
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
      info("Image selected successfully");
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      warning("Permission required to access camera");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      info("Photo captured successfully");
    }
  };

  const handleContinue = () => {
    if (!selectedImage) {
      showError("Please select an X-ray image first");
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
        <Card elevated="light">
          <View style={styles.instructionsHeader}>
            <Ionicons name="information-circle" size={24} color="#0B5ED7" />
            <Text style={styles.instructionsTitle}>Upload Guidelines</Text>
          </View>
          <View style={styles.guidelinesList}>
            <View style={styles.guidelineItem}>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              <Text style={styles.instructionsText}>
                Upload a clear chest X-ray image
              </Text>
            </View>
            <View style={styles.guidelineItem}>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              <Text style={styles.instructionsText}>
                Accepted formats: JPG, PNG
              </Text>
            </View>
            <View style={styles.guidelineItem}>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              <Text style={styles.instructionsText}>
                Ensure good lighting and clarity
              </Text>
            </View>
            <View style={styles.guidelineItem}>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              <Text style={styles.instructionsText}>
                Image should show full chest area
              </Text>
            </View>
          </View>
        </Card>

        <Card elevated="medium">
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
                <Ionicons name="close-circle" size={32} color="#EF4444" />
              </TouchableOpacity>
              <View style={styles.imageStatusBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                <Text style={styles.imageStatusText}>Image Ready</Text>
              </View>
            </View>
          ) : (
            <View style={styles.placeholderContainer}>
              <View style={styles.placeholderIcon}>
                <Ionicons name="image-outline" size={64} color="#D1D5DB" />
              </View>
              <Text style={styles.placeholderTitle}>No image selected</Text>
              <Text style={styles.placeholderSubtext}>
                Choose from gallery or take a photo
              </Text>
            </View>
          )}
        </Card>

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
            <Ionicons name="camera-outline" size={24} color="#0B5ED7" />
            <View style={styles.buttonTextContainer}>
              <Text style={styles.cameraButtonText}>Take Photo</Text>
              <Text style={styles.cameraButtonSubtext}>Use device camera</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Card elevated="light" backgroundColor="rgba(245, 158, 11, 0.08)">
          <View style={styles.sampleHeader}>
            <Text style={styles.sampleIcon}>📷</Text>
            <Text style={styles.sampleTitle}>Demo Mode</Text>
          </View>
          <Text style={styles.sampleText}>
            For demo purposes, any chest X-ray image can be used. The AI will
            simulate a realistic diagnosis based on the uploaded image.
          </Text>
        </Card>

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
    backgroundColor: "#FAFBFC",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTextContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 3,
    fontWeight: "500",
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(11, 94, 215, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  instructionsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.2,
  },
  guidelinesList: {
    gap: 12,
  },
  guidelineItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  instructionsText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    flex: 1,
    fontWeight: "500",
  },
  imagePreviewContainer: {
    width: "100%",
    position: "relative",
  },
  previewImage: {
    width: "100%",
    height: 300,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  removeButton: {
    position: "absolute",
    top: -14,
    right: -14,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  imageStatusBadge: {
    position: "absolute",
    bottom: 14,
    left: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  imageStatusText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#10B981",
  },
  placeholderContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  placeholderIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  placeholderTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  uploadOptions: {
    gap: 12,
    marginBottom: 24,
  },
  uploadButton: {
    flexDirection: "row",
    backgroundColor: "#0B5ED7",
    borderRadius: 14,
    padding: 18,
    alignItems: "center",
    gap: 14,
    shadowColor: "#0B5ED7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  buttonTextContainer: {
    flex: 1,
  },
  uploadButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  uploadButtonSubtext: {
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: 12,
    marginTop: 3,
    fontWeight: "500",
  },
  cameraButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.04,
  },
  cameraButtonText: {
    color: "#0B5ED7",
    fontSize: 15,
    fontWeight: "700",
  },
  cameraButtonSubtext: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 3,
    fontWeight: "500",
  },
  sampleHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  sampleIcon: {
    fontSize: 20,
  },
  sampleTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#D97706",
  },
  sampleText: {
    fontSize: 13,
    color: "#92400E",
    lineHeight: 20,
    fontWeight: "500",
  },
  continueButton: {
    flexDirection: "row",
    backgroundColor: "#0B5ED7",
    borderRadius: 14,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#0B5ED7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
