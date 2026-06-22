import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
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

  const loadDemoCase = () => {
    // A real clinical chest X-ray image from public dataset
    setSelectedImage("https://raw.githubusercontent.com/ieee8023/covid-chestxray-dataset/master/images/000001-1.jpg");
    info("Clinical demo chest X-ray loaded");
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
    
    // Bypass validation for the remote demo image
    if (selectedImage.startsWith("http")) {
      router.push({
        pathname: "/analysis/patient-info",
        params: { imageUri: selectedImage },
      });
      return;
    }

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
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top + 8 : 16 }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Analyze Scan</Text>
            <Text style={styles.headerSubtitle}>Step 1 of 3: Select Chest X-Ray</Text>
          </View>
          <View style={styles.headerIcon}>
            <Ionicons name="scan-outline" size={22} color={COLORS.primary} />
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Radiology Silhouette Upload Area */}
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
            <View style={styles.placeholderContainer}>
              {/* Radiology Box Scale Markers */}
              <View style={[styles.scaleMarker, styles.scaleMarkerTopLeft]} />
              <View style={[styles.scaleMarker, styles.scaleMarkerTopRight]} />
              <View style={[styles.scaleMarker, styles.scaleMarkerBottomLeft]} />
              <View style={[styles.scaleMarker, styles.scaleMarkerBottomRight]} />
              
              <View style={styles.placeholderContent}>
                <MaterialCommunityIcons name="lungs" size={96} color="#334155" />
                <Text style={styles.placeholderTitle}>Awaiting Radiographic Input</Text>
                <Text style={styles.placeholderSubtext}>
                  No active chest scan selected
                </Text>
              </View>
              
              {/* Calibration Grid Lines */}
              <View style={styles.gridLineHorizontal} />
              <View style={styles.gridLineVertical} />
            </View>
          )}
        </Card>

        {/* Accepted Formats & Security Guideline Cards */}
        <View style={styles.guidelinesSection}>
          <View style={styles.guidelineCard}>
            <Ionicons name="options-outline" size={20} color={COLORS.primary} />
            <View style={styles.guidelineTextContent}>
              <Text style={styles.guidelineTitle}>PA / AP Views</Text>
              <Text style={styles.guidelineSubtitle}>Chest projection scans</Text>
            </View>
          </View>

          <View style={styles.guidelineCard}>
            <Ionicons name="document-text-outline" size={20} color={COLORS.primary} />
            <View style={styles.guidelineTextContent}>
              <Text style={styles.guidelineTitle}>DICOM, PNG, JPEG</Text>
              <Text style={styles.guidelineSubtitle}>Supported file formats</Text>
            </View>
          </View>

          <View style={styles.guidelineCard}>
            <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.primary} />
            <View style={styles.guidelineTextContent}>
              <Text style={styles.guidelineTitle}>Secure Patient Data</Text>
              <Text style={styles.guidelineSubtitle}>Encrypted locally and in-transit</Text>
            </View>
          </View>
        </View>

        {/* Direct Action Triggers */}
        <View style={styles.uploadOptions}>
          <TouchableOpacity style={styles.primaryActionButton} onPress={pickImage}>
            <Ionicons name="image-outline" size={20} color="#FFFFFF" />
            <Text style={styles.primaryActionButtonText}>Choose X-Ray Scan</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryActionButton} onPress={takePhoto}>
            <Ionicons name="camera-outline" size={20} color={COLORS.primary} />
            <Text style={styles.secondaryActionButtonText}>Capture Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.demoActionButton} onPress={loadDemoCase}>
            <Ionicons name="play-circle-outline" size={20} color={COLORS.textSecondary} />
            <Text style={styles.demoActionButtonText}>Try Demo Case</Text>
          </TouchableOpacity>
        </View>

        {/* Proceed Action Button */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedImage && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!selectedImage}
        >
          <Text style={styles.continueButtonText}>
            Continue to Patient Details
          </Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
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
    backgroundColor: "#0F172A",
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
    backgroundColor: "#0F172A",
    borderRadius: BORDER_RADIUS.md,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  placeholderContent: {
    alignItems: "center",
    zIndex: 10,
  },
  placeholderTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#E2E8F0",
    marginTop: 16,
    letterSpacing: -0.2,
  },
  placeholderSubtext: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 6,
    fontWeight: "600",
  },
  scaleMarker: {
    position: "absolute",
    width: 14,
    height: 14,
    borderColor: "#475569",
    zIndex: 5,
  },
  scaleMarkerTopLeft: {
    top: 16,
    left: 16,
    borderTopWidth: 2,
    borderLeftWidth: 2,
  },
  scaleMarkerTopRight: {
    top: 16,
    right: 16,
    borderTopWidth: 2,
    borderRightWidth: 2,
  },
  scaleMarkerBottomLeft: {
    bottom: 16,
    left: 16,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  scaleMarkerBottomRight: {
    bottom: 16,
    right: 16,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
  gridLineHorizontal: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 0.5,
    backgroundColor: "rgba(71, 85, 105, 0.2)",
    top: "50%",
  },
  gridLineVertical: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 0.5,
    backgroundColor: "rgba(71, 85, 105, 0.2)",
    left: "50%",
  },
  guidelinesSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 16,
    marginBottom: 20,
  },
  guidelineCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.sm,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  guidelineTextContent: {
    alignItems: "center",
    marginTop: 6,
  },
  guidelineTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.textPrimary,
    textAlign: "center",
  },
  guidelineSubtitle: {
    fontSize: 9,
    color: COLORS.textSecondary,
    fontWeight: "600",
    marginTop: 2,
    textAlign: "center",
  },
  uploadOptions: {
    gap: 10,
    marginBottom: 24,
  },
  primaryActionButton: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.sm,
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
    borderRadius: BORDER_RADIUS.sm,
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
    borderRadius: BORDER_RADIUS.sm,
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
    borderRadius: BORDER_RADIUS.sm,
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
