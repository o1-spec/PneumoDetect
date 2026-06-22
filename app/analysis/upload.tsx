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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "../../components/premium";
import { useToast } from "../../hooks/useToast";
import { COLORS, BORDER_RADIUS, SHADOWS, SPACING } from "../../constants/Theme";

export default function UploadScreen() {
  const insets = useSafeAreaInsets();
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

    // Security check: Validate file extension is PNG or JPG/JPEG strictly
    const filename = selectedImage.split("/").pop() || "";
    const match = /\.(\w+)$/.exec(filename);
    const ext = match ? match[1].toLowerCase() : "";
    const allowedExtensions = ["jpg", "jpeg", "png"];
    
    if (ext && !allowedExtensions.includes(ext)) {
      showError("Invalid file type. Only JPG, JPEG, and PNG images are allowed.");
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
      <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top + 8 : 16 }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Upload X-Ray</Text>
            <Text style={styles.headerSubtitle}>Step 1 of 3</Text>
          </View>
          <View style={styles.headerIcon}>
            <Ionicons name="cloud-upload-outline" size={24} color={COLORS.primary} />
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
            <Ionicons name="information-circle" size={24} color={COLORS.primary} />
            <Text style={styles.instructionsTitle}>Upload Guidelines</Text>
          </View>
          <View style={styles.guidelinesList}>
            <View style={styles.guidelineItem}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
              <Text style={styles.instructionsText}>
                Upload a clear chest X-ray image
              </Text>
            </View>
            <View style={styles.guidelineItem}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
              <Text style={styles.instructionsText}>
                Accepted formats: JPG, PNG
              </Text>
            </View>
            <View style={styles.guidelineItem}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
              <Text style={styles.instructionsText}>
                Ensure good lighting and clarity
              </Text>
            </View>
            <View style={styles.guidelineItem}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
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
                <Ionicons name="close-circle" size={32} color={COLORS.danger} />
              </TouchableOpacity>
              <View style={styles.imageStatusBadge}>
                <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                <Text style={styles.imageStatusText}>Image Ready</Text>
              </View>
            </View>
          ) : (
            <View style={styles.placeholderContainer}>
              <View style={styles.placeholderIcon}>
                <Ionicons name="image-outline" size={64} color={COLORS.border} />
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
            <Ionicons name="camera-outline" size={24} color={COLORS.primary} />
            <View style={styles.buttonTextContainer}>
              <Text style={styles.cameraButtonText}>Take Photo</Text>
              <Text style={styles.cameraButtonSubtext}>Use device camera</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Card elevated="light" backgroundColor={COLORS.warningLight}>
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
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.card,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...SHADOWS.light,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
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
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 3,
    fontWeight: "500",
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
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
    color: COLORS.textPrimary,
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
    color: COLORS.textSecondary,
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
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primaryLight,
  },
  removeButton: {
    position: "absolute",
    top: -14,
    right: -14,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    shadowColor: "rgba(0, 0, 0, 0.12)",
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
    shadowColor: "rgba(0, 0, 0, 0.08)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  imageStatusText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.success,
  },
  placeholderContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  placeholderIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  placeholderTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: COLORS.textTertiary,
    fontWeight: "500",
  },
  uploadOptions: {
    gap: 12,
    marginBottom: 24,
  },
  uploadButton: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: 18,
    alignItems: "center",
    gap: 14,
    ...SHADOWS.light,
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
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  cameraButtonText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: "700",
  },
  cameraButtonSubtext: {
    color: COLORS.textSecondary,
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
    color: COLORS.warning,
  },
  sampleText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
    fontWeight: "500",
  },
  continueButton: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    ...SHADOWS.medium,
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
