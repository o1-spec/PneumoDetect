import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DialogData, dialogManager } from "../utils/dialogManager";

export const DialogContainer: React.FC = () => {
  const [dialog, setDialog] = useState<DialogData | null>(null);

  useEffect(() => {
    const unsubscribe = dialogManager.subscribe((d) => {
      setDialog(d);
    });
    return unsubscribe;
  }, []);

  const handleClose = () => {
    dialogManager.hide();
  };

  if (!dialog) return null;

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{dialog.title}</Text>
          {dialog.message && <Text style={styles.message}>{dialog.message}</Text>}

          <View style={styles.buttonContainer}>
            {(dialog.buttons || [{ text: "OK" }]).map((btn, index) => {
              const isDestructive = btn.style === "destructive";
              const isCancel = btn.style === "cancel";
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.button,
                    isDestructive && styles.destructiveButton,
                    isCancel && styles.cancelButton,
                    dialog.buttons?.length === 2 && styles.halfButton,
                  ]}
                  onPress={() => {
                    handleClose();
                    if (btn.onPress) btn.onPress();
                  }}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      isDestructive && styles.destructiveButtonText,
                      isCancel && styles.cancelButtonText,
                    ]}
                  >
                    {btn.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 15,
    color: "#4B5563",
    lineHeight: 22,
    marginBottom: 24,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0B5ED7",
  },
  halfButton: {
    flex: 1,
  },
  cancelButton: {
    backgroundColor: "#F3F4F6",
  },
  destructiveButton: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  cancelButtonText: {
    color: "#4B5563",
  },
  destructiveButtonText: {
    color: "#EF4444",
  },
});
