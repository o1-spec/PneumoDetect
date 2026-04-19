import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { notificationsAPI } from "../../services/api.client";
import { Notification } from "../../types/api";
import { getErrorMessage } from "../../utils/errorHandler";

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Load notifications when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, []),
  );

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationsAPI.getAll();
      setNotifications(data);
    } catch (err) {
      Alert.alert("Error", getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const data = await notificationsAPI.getAll();
      setNotifications(data);
    } catch (err) {
      Alert.alert("Error", getErrorMessage(err));
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
      Alert.alert("Error", getErrorMessage(err));
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true })),
      );
      Alert.alert("Success", "All notifications marked as read");
    } catch (err) {
      Alert.alert("Error", getErrorMessage(err));
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      "Delete Notification",
      "Are you sure you want to delete this notification?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await notificationsAPI.delete(id);
              setNotifications((prev) => prev.filter((n) => n.id !== id));
            } catch (err) {
              Alert.alert("Error", getErrorMessage(err));
            }
          },
        },
      ],
    );
  };

  const handleClearAll = () => {
    if (notifications.length === 0) {
      Alert.alert("No Notifications", "There are no notifications to clear.");
      return;
    }

    Alert.alert(
      "Clear All Notifications",
      "Are you sure you want to delete all notifications? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            try {
              await Promise.all(
                notifications.map((n) => notificationsAPI.delete(n.id)),
              );
              setNotifications([]);
              Alert.alert("Success", "All notifications cleared");
            } catch (err) {
              Alert.alert("Error", getErrorMessage(err));
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#0066CC" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Notifications</Text>
            {unreadCount > 0 && (
              <Text style={styles.headerSubtitle}>{unreadCount} unread</Text>
            )}
          </View>
          {notifications.length > 0 && (
            <TouchableOpacity
              style={styles.moreButton}
              onPress={() =>
                Alert.alert("Options", "Choose an action", [
                  {
                    text: "Mark All as Read",
                    onPress: handleMarkAllAsRead,
                  },
                  {
                    text: "Clear All",
                    onPress: handleClearAll,
                    style: "destructive",
                  },
                  { text: "Cancel", style: "cancel" },
                ])
              }
            >
              <Ionicons name="ellipsis-horizontal" size={24} color="#0066CC" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color="#0066CC" />
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconContainer}>
            <Ionicons
              name="notifications-off-outline"
              size={64}
              color="#C7C7CC"
            />
          </View>
          <Text style={styles.emptyTitle}>No Notifications</Text>
          <Text style={styles.emptyText}>
            You're all caught up! We'll notify you when something important
            happens.
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {unreadCount > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>New</Text>
              {notifications
                .filter((n) => !n.read)
                .map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onPress={() => handleMarkAsRead(notification.id)}
                    onDelete={() => handleDelete(notification.id)}
                  />
                ))}
            </View>
          )}

          {notifications.filter((n) => n.read).length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Earlier</Text>
              {notifications
                .filter((n) => n.read)
                .map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onPress={() => handleMarkAsRead(notification.id)}
                    onDelete={() => handleDelete(notification.id)}
                  />
                ))}
            </View>
          )}

          <View style={styles.bottomSpacer} />
        </ScrollView>
      )}
    </View>
  );
}

const NotificationCard = ({
  notification,
  onPress,
  onDelete,
}: {
  notification: Notification;
  onPress: () => void;
  onDelete: () => void;
}) => (
  <View
    style={[styles.notificationCard, !notification.read && styles.unreadCard]}
  >
    <TouchableOpacity style={styles.cardContent} onPress={onPress}>
      <View style={styles.notificationIcon}>
        <Ionicons name="notifications" size={24} color="#0066CC" />
      </View>
      <View style={styles.notificationContent}>
        <Text
          style={[
            styles.notificationTitle,
            !notification.read && styles.unreadTitle,
          ]}
          numberOfLines={1}
        >
          {notification.title}
        </Text>
        <Text style={styles.notificationMessage} numberOfLines={2}>
          {notification.message}
        </Text>
        <Text style={styles.notificationTime}>
          {new Date(notification.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
    <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
      <Ionicons name="trash-outline" size={20} color="#D32F2F" />
    </TouchableOpacity>
  </View>
);

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
    color: "#0066CC",
    marginTop: 2,
    fontWeight: "600",
  },
  moreButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F7",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8E8E93",
    marginBottom: 12,
    marginLeft: 4,
  },
  notificationCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#0066CC",
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    flex: 1,
  },
  unreadTitle: {
    fontWeight: "bold",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#0066CC",
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: "#636366",
    lineHeight: 20,
    marginBottom: 6,
  },
  notificationTime: {
    fontSize: 12,
    color: "#8E8E93",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F5F5F7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
    lineHeight: 24,
  },
  bottomSpacer: {
    height: 40,
  },
  cardContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  deleteButton: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
