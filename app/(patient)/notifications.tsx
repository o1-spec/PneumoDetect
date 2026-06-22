import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { notificationsAPI } from "../../services/api.client";
import { Notification } from "../../types/api";
import { getErrorMessage } from "../../utils/errorHandler";
import { dialogManager } from "../../utils/dialogManager";
import { useToast } from "../../hooks/useToast";
import { PneumoLoader } from "../../components/premium/PneumoLoader";
import { COLORS, BORDER_RADIUS, SHADOWS, SPACING } from "../../constants/Theme";

export default function PatientNotificationsScreen() {
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { error: showError, success: showSuccess } = useToast();

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, []),
  );

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationsAPI.getAll();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      showError(getErrorMessage(err));
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const data = await notificationsAPI.getAll();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setRefreshing(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationsAPI.update(id, { read: true });
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, read: true } : notif,
        ),
      );
    } catch (err) {
      showError(getErrorMessage(err));
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true })),
      );
      showSuccess("All alerts marked as read");
    } catch (err) {
      showError(getErrorMessage(err));
    }
  };

  const handleDelete = async (id: string) => {
    dialogManager.show({
      title: "Delete Notification",
      message: "Are you sure you want to delete this notification?",
      buttons: [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await notificationsAPI.delete(id);
              setNotifications((prev) => prev.filter((n) => n.id !== id));
            } catch (err) {
              showError(getErrorMessage(err));
            }
          },
        },
      ],
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins || 1}m ago`;
    }
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }
    if (diffDays === 1) {
      return "Yesterday";
    }
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Map backend raw text or notification titles to patient-friendly strings
  const getPatientFriendlyNotification = (notif: Notification) => {
    let title = notif.title;
    let message = notif.message;

    if (title.toUpperCase().includes("LINK")) {
      title = "Account Verified";
      message = "Your medical profile is now successfully linked.";
    } else if (title.toUpperCase().includes("UPLOAD")) {
      title = "Scan Uploaded";
      message = "Your chest scan was successfully uploaded to secure files.";
    } else if (title.toUpperCase().includes("PROCESS") || title.toUpperCase().includes("COMPLETE") || title.toUpperCase().includes("DIAGNOSIS") || title.toUpperCase().includes("RESULT")) {
      title = "Analysis Complete";
      message = "Your chest X-ray review has been processed by the AI system.";
    }

    return { title, message };
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top + 8 : 16 }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.replace("/(patient)")}>
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Recent Activity</Text>
          {notifications.length > 0 ? (
            <TouchableOpacity
              style={styles.moreButton}
              onPress={() =>
                dialogManager.show({
                  title: "Options",
                  message: "Choose an action",
                  buttons: [
                    {
                      text: "Mark All as Read",
                      onPress: handleMarkAllAsRead,
                    },
                    { text: "Cancel", style: "cancel" },
                  ],
                })
              }
            >
              <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 40 }} />
          )}
        </View>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <PneumoLoader size={48} color={COLORS.primary} />
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No recent updates</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          <View style={styles.timelineList}>
            {notifications.map((notif, index) => {
              const { title, message } = getPatientFriendlyNotification(notif);
              const isLast = index === notifications.length - 1;
              return (
                <View key={notif.id} style={styles.timelineItem}>
                  <View style={styles.timelineLeft}>
                    <TouchableOpacity
                      style={[
                        styles.timelineIndicator,
                        notif.read ? styles.indicatorRead : styles.indicatorUnread,
                      ]}
                      onPress={() => handleMarkAsRead(notif.id)}
                    >
                      <Ionicons
                        name={notif.read ? "checkmark" : "ellipse"}
                        size={notif.read ? 12 : 8}
                        color={notif.read ? COLORS.textTertiary : COLORS.primary}
                      />
                    </TouchableOpacity>
                    {!isLast && <View style={styles.timelineLine} />}
                  </View>

                  <View style={styles.timelineRight}>
                    <View style={styles.notificationHeader}>
                      <Text style={[styles.notificationTitle, !notif.read && styles.unreadTitle]}>
                        {title}
                      </Text>
                      <Text style={styles.notificationTime}>{formatTime(notif.createdAt)}</Text>
                    </View>
                    
                    <Text style={styles.notificationMessage}>{message}</Text>
                    
                    <View style={styles.cardActions}>
                      {!notif.read && (
                        <TouchableOpacity
                          style={styles.actionLink}
                          onPress={() => handleMarkAsRead(notif.id)}
                        >
                          <Text style={styles.actionLinkText}>Mark read</Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        style={styles.deleteLink}
                        onPress={() => handleDelete(notif.id)}
                      >
                        <Text style={styles.deleteLinkText}>Clear</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}
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
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  moreButton: {
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
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 100,
  },
  timelineList: {
    gap: 0,
  },
  timelineItem: {
    flexDirection: "row",
    minHeight: 88,
  },
  timelineLeft: {
    alignItems: "center",
    marginRight: 16,
    width: 24,
  },
  timelineIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    backgroundColor: COLORS.card,
  },
  indicatorUnread: {
    borderColor: COLORS.primary,
  },
  indicatorRead: {
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  timelineLine: {
    width: 1.5,
    position: "absolute",
    top: 24,
    bottom: -16,
    backgroundColor: COLORS.border,
    zIndex: 5,
  },
  timelineRight: {
    flex: 1,
    paddingBottom: 24,
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  unreadTitle: {
    color: COLORS.primary,
    fontWeight: "800",
  },
  notificationTime: {
    fontSize: 12,
    color: COLORS.textTertiary,
    fontWeight: "500",
  },
  notificationMessage: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
    lineHeight: 18,
    fontWeight: "500",
  },
  cardActions: {
    flexDirection: "row",
    gap: 16,
    marginTop: 8,
  },
  actionLink: {
    paddingVertical: 2,
  },
  actionLinkText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
  },
  deleteLink: {
    paddingVertical: 2,
  },
  deleteLinkText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textTertiary,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 120,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
});
