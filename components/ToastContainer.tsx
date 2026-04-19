import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Toast as ToastType, toastManager } from "../utils/toastManager";

const { width } = Dimensions.get("window");

interface ToastItem extends ToastType {
  animValue: Animated.Value;
}

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const unsubscribe = toastManager.subscribe((toast) => {
      const animValue = new Animated.Value(0);

      const newToastItem: ToastItem = {
        ...toast,
        animValue,
      };

      setToasts((prev) => [...prev, newToastItem]);

      // Animate in
      Animated.timing(animValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Auto-dismiss after duration
      const timeoutId = setTimeout(() => {
        dismissToast(toast.id, animValue);
      }, toast.duration || 3000);

      return () => clearTimeout(timeoutId);
    });

    return unsubscribe;
  }, []);

  const dismissToast = (id: string, animValue: Animated.Value) => {
    Animated.timing(animValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    });
  };

  return (
    <View style={styles.container} pointerEvents="box-none">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={() => dismissToast(toast.id, toast.animValue)}
        />
      ))}
    </View>
  );
};

interface ToastItemProps {
  toast: ToastItem;
  onDismiss: () => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  const getBackgroundColor = () => {
    switch (toast.type) {
      case "success":
        return "#10B981";
      case "error":
        return "#EF4444";
      case "warning":
        return "#F59E0B";
      case "info":
        return "#3B82F6";
      default:
        return "#1F2937";
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return "checkmark-circle";
      case "error":
        return "alert-circle";
      case "warning":
        return "warning";
      case "info":
        return "information-circle";
      default:
        return "information-circle";
    }
  };

  const translateY = toast.animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 0],
  });

  const opacity = toast.animValue;

  return (
    <Animated.View
      style={[
        styles.toastWrapper,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <TouchableOpacity
        style={[styles.toast, { backgroundColor: getBackgroundColor() }]}
        activeOpacity={0.95}
        onPress={onDismiss}
      >
        <View style={styles.toastContent}>
          <Ionicons
            name={getIcon() as any}
            size={20}
            color="#FFFFFF"
            style={styles.toastIcon}
          />
          <Text style={styles.toastMessage} numberOfLines={2}>
            {toast.message}
          </Text>
        </View>
        <TouchableOpacity onPress={onDismiss} hitSlop={10}>
          <Ionicons name="close" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingHorizontal: 16,
    paddingTop: 50,
    pointerEvents: "box-none",
  },
  toastWrapper: {
    marginBottom: 12,
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  toastContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  toastIcon: {
    marginRight: 12,
  },
  toastMessage: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
});
