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
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "../../components/premium";
import { useToast } from "../../hooks/useToast";
import { scansAPI, usersAPI } from "../../services/api.client";
import { COLORS, BORDER_RADIUS, SHADOWS, SPACING } from "../../constants/Theme";

export default function PatientUploadScreen() {
  const insets = useSafeAreaInsets();
  const { warning, error: showError, info, success } = useToast();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

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
      info("Scan selected successfully");
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

  const loadDemoCase = () => {
    setSelectedImage("https://raw.githubusercontent.com/ieee8023/covid-chestxray-dataset/master/images/000001-1.jpg");
    info("Demo chest scan loaded");
  };

  const handleUploadAndAnalyze = async () => {
    if (!selectedImage) {
      showError("Please select a scan image first");
      return;
    }

    // Validate file extension for local files
    if (!selectedImage.startsWith("http")) {
      const filename = selectedImage.split("/").pop() || "";
      const match = /\.(\w+)$/.exec(filename);
      const ext = match ? match[1].toLowerCase() : "";
      const allowedExtensions = ["jpg", "jpeg", "png"];
      if (ext && !allowedExtensions.includes(ext)) {
        showError("Invalid file type. Only JPG, JPEG, and PNG images are allowed.");
        return;
      }
    }

    try {
      setUploading(true);
      
      // Get the logged in patient's profile to resolve their patient clinical record ID
      const profile = await usersAPI.getPatientProfile();
      const patientRecordId = profile.patientRecordId;
      
      if (!patientRecordId) {
        throw new Error("Unable to locate linked medical record. Please contact support.");
      }

      // Upload the scan image under the patient's record ID
      const scan = await scansAPI.upload(patientRecordId, selectedImage);

      success("Scan uploaded successfully! Initiating analysis...");

      // Redirect to the self-contained patient processing view
      router.replace({
        pathname: "/(patient)/processing",
        params: { scanId: scan.id },
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to upload scan";
      showError(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top + 8 : 16 }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.replace("/(patient)")}>
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Upload Scan</Text>
            <Text style={styles.headerSubtitle}>Select a chest X-ray to analyze</Text>
          </View>
          <View style={styles.headerIcon}>
            <Ionicons name="cloud-upload-outline" size={22} color={COLORS.primary} />
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Soft, patient-friendly scan preview area */}
        <Card elevated="medium" padded={false}>
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
                <Text style={styles.imageStatusText}>Scan Loaded</Text>
              </View>
            </View>
          ) : (
            <TouchableOpacity style={styles.placeholderContainer} onPress={pickImage}>
              <View style={styles.placeholderContent}>
                <View style={styles.lungsIconCircle}>
                  <Ionicons name="image-outline" size={48} color={COLORS.primary} />
                </View>
                <Text style={styles.placeholderTitle}>Select Chest Scan</Text>
                <Text style={styles.placeholderSubtext}>
                  Tap to browse photos or capture a new photo
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </Card>

        {/* Informative tips */}
        <View style={styles.guidelinesSection}>
          <View style={styles.guidelineCard}>
            <Ionicons name="information-circle-outline" size={20} color={COLORS.primary} />
            <Text style={styles.guidelineTitle}>PA / AP Chest Scan</Text>
            <Text style={styles.guidelineSubtitle}>Ensure the image is a front-facing chest scan</Text>
          </View>
          <View style={styles.guidelineCard}>
            <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.success} />
            <Text style={styles.guidelineTitle}>Encrypted & Secure</Text>
            <Text style={styles.guidelineSubtitle}>Your medical imagery remains private and protected</Text>
          </View>
        </View>

        {/* Upload Options */}
        <View style={styles.uploadOptions}>
          <TouchableOpacity style={styles.primaryActionButton} onPress={pickImage}>
            <Ionicons name="image-outline" size={20} color="#FFFFFF" />
            <Text style={styles.primaryActionButtonText}>Choose from Photos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryActionButton} onPress={takePhoto}>
            <Ionicons name="camera-outline" size={20} color={COLORS.primary} />
            <Text style={styles.secondaryActionButtonText}>Take a Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.demoActionButton} onPress={loadDemoCase}>
            <Ionicons name="play-circle-outline" size={20} color={COLORS.textSecondary} />
            <Text style={styles.demoActionButtonText}>Use Demo Scan</Text>
          </TouchableOpacity>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            (!selectedImage || uploading) && styles.continueButtonDisabled,
          ]}
          onPress={handleUploadAndAnalyze}
          disabled={!selectedImage || uploading}
        >
          {uploading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              <Text style={styles.continueButtonText}>Start Analysis</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </>
          )}
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
  imagePreviewContainer: {
    width: "100%",
    position: "relative",
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
  },
  removeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    ...SHADOWS.light,
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
    borderRadius: 12,
    ...SHADOWS.light,
  },
  imageStatusText: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.success,
  },
  placeholderContainer: {
    height: 300,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: "dashed",
  },
  placeholderContent: {
    alignItems: "center",
    paddingHorizontal: 32,
  },
  lungsIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  placeholderTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  placeholderSubtext: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 8,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 18,
  },
  guidelinesSection: {
    gap: 12,
    marginTop: 16,
    marginBottom: 24,
  },
  guidelineCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: 16,
    flexDirection: "column",
    gap: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  guidelineTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  guidelineSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "500",
    lineHeight: 16,
  },
  uploadOptions: {
    gap: 12,
    marginBottom: 24,
  },
  primaryActionButton: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    ...SHADOWS.light,
  },
  primaryActionButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  secondaryActionButton: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  secondaryActionButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "800",
  },
  demoActionButton: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  demoActionButtonText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: "700",
  },
  continueButton: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 16,
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
    fontSize: 15,
    fontWeight: "800",
  },
});
