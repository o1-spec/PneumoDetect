import { useToast } from "@/hooks/useToast";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Modal,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface PatientNotesModalProps {
  visible: boolean;
  currentNotes: string | undefined;
  onClose: () => void;
  onSave: (notes: string) => Promise<void>;
  loading?: boolean;
}

export const PatientNotesModal: React.FC<PatientNotesModalProps> = ({
  visible,
  currentNotes,
  onClose,
  onSave,
  loading = false,
}) => {
  const [notes, setNotes] = useState(currentNotes || "");
  const { showToast } = useToast();

  const handleSave = async () => {
    try {
      if (notes.length > 1000) {
        Alert.alert("Error", "Notes cannot exceed 1000 characters");
        return;
      }

      await onSave(notes);
      showToast("Patient notes updated successfully", "success");
      onClose();
    } catch (error) {
      showToast("Failed to save patient notes", "error");
    }
  };

  const handleCancel = () => {
    setNotes(currentNotes || "");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCancel}
    >
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
        <View
          style={{
            flex: 1,
            marginTop: "auto",
            backgroundColor: "white",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingTop: 20,
            paddingHorizontal: 20,
            paddingBottom: 30,
            maxHeight: "80%",
          }}
        >
          {/* Header */}
          <View
            style={{
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: "#1a1a1a",
              }}
            >
              Patient Notes
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#666",
                marginTop: 4,
              }}
            >
              Add or edit clinical notes for this scan
            </Text>
          </View>

          {/* Text Input */}
          <TextInput
            style={{
              backgroundColor: "#f5f5f5",
              borderRadius: 10,
              padding: 12,
              fontSize: 14,
              color: "#1a1a1a",
              minHeight: 120,
              maxHeight: 250,
              textAlignVertical: "top",
              borderWidth: 1,
              borderColor: "#e0e0e0",
              marginBottom: 12,
            }}
            placeholder="Enter clinical notes..."
            placeholderTextColor="#999"
            multiline={true}
            editable={!loading}
            value={notes}
            onChangeText={setNotes}
            maxLength={1000}
          />

          {/* Character Count */}
          <Text
            style={{
              fontSize: 12,
              color: notes.length > 900 ? "#ff6b6b" : "#999",
              marginBottom: 16,
              textAlign: "right",
            }}
          >
            {notes.length}/1000
          </Text>

          {/* Buttons */}
          <View
            style={{
              flexDirection: "row",
              gap: 12,
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                paddingVertical: 12,
                paddingHorizontal: 16,
                backgroundColor: "#f5f5f5",
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={handleCancel}
              disabled={loading}
            >
              <Text
                style={{
                  color: "#666",
                  fontSize: 14,
                  fontWeight: "500",
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
                paddingVertical: 12,
                paddingHorizontal: 16,
                backgroundColor: loading ? "#ccc" : "#007AFF",
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
              }}
              onPress={handleSave}
              disabled={loading}
            >
              {loading && (
                <ActivityIndicator
                  size="small"
                  color="white"
                  style={{ marginRight: 8 }}
                />
              )}
              <Text
                style={{
                  color: "white",
                  fontSize: 14,
                  fontWeight: "600",
                }}
              >
                Save Notes
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
