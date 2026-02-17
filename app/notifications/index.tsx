import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const NOTIFICATIONS_DATA = [
  {
    id: "1",
    type: "scan",
    icon: "medical",
    iconColor: "#D32F2F",
    iconBg: "#FFEBEE",
    title: "High-Risk Scan Detected",
    message: "Patient John Doe - Pneumonia detected with 94.5% confidence",
    time: "5 minutes ago",
    read: false,
  },
  {
    id: "2",
    type: "system",
    icon: "checkmark-circle",
    iconColor: "#4CAF50",
    iconBg: "#E8F5E9",
    title: "Scan Completed",
    message: "Analysis for Patient Jane Smith completed successfully",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    type: "user",
    icon: "person-add",
    iconColor: "#0066CC",
    iconBg: "#E3F2FD",
    title: "New User Added",
    message: "Dr. Michael Chen has been added to your team",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "4",
    type: "report",
    icon: "document-text",
    iconColor: "#FF9800",
    iconBg: "#FFF3E0",
    title: "Weekly Report Ready",
    message: "Your weekly performance report is now available",
    time: "3 hours ago",
    read: true,
  },
  {
    id: "5",
    type: "system",
    icon: "warning",
    iconColor: "#FF9800",
    iconBg: "#FFF3E0",
    title: "Storage Warning",
    message: "Storage usage is at 78%. Consider archiving old scans",
    time: "5 hours ago",
    read: true,
  },
  {
    id: "6",
    type: "scan",
    icon: "analytics",
    iconColor: "#9C27B0",
    iconBg: "#F3E5F5",
    title: "Monthly Statistics",
    message: "You've analyzed 24 scans this month with 95% accuracy",
    time: "1 day ago",
    read: true,
  },
  {
    id: "7",
    type: "system",
    icon: "shield-checkmark",
    iconColor: "#4CAF50",
    iconBg: "#E8F5E9",
    title: "Security Update",
    message: "Two-factor authentication is now enabled for your account",
    time: "2 days ago",
    read: true,
  },
  {
    id: "8",
    type: "info",
    icon: "information-circle",
    iconColor: "#00BCD4",
    iconBg: "#E0F7FA",
    title: "New Feature Available",
    message: "Check out the new batch upload feature for multiple scans",
    time: "3 days ago",
    read: true,
  },
];

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(NOTIFICATIONS_DATA);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
    Alert.alert("Success", "All notifications marked as read");
  };

  const handleClearAll = () => {
    Alert.alert(
      "Clear All Notifications",
      "Are you sure you want to clear all notifications? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: () => {
            setNotifications([]);
            Alert.alert("Success", "All notifications cleared");
          },
        },
      ]
    );
  };

  const handleNotificationPress = (notification: typeof NOTIFICATIONS_DATA[0]) => {
    handleMarkAsRead(notification.id);

    // Navigate based on notification type
    switch (notification.type) {
      case "scan":
        router.push("/(tabs)/history");
        break;
      case "user":
        router.push("/(tabs)/(admin)/users");
        break;
      case "report":
        Alert.alert("Report", "Generating your weekly report...");
        break;
      default:
        Alert.alert(notification.title, notification.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
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
              <Text style={styles.headerSubtitle}>
                {unreadCount} unread
              </Text>
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

      {notifications.length === 0 ? (
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
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Unread Section */}
          {unreadCount > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>New</Text>
              {notifications
                .filter((n) => !n.read)
                .map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onPress={() => handleNotificationPress(notification)}
                  />
                ))}
            </View>
          )}

          {/* Read Section */}
          {notifications.filter((n) => n.read).length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Earlier</Text>
              {notifications
                .filter((n) => n.read)
                .map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onPress={() => handleNotificationPress(notification)}
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
}: {
  notification: typeof NOTIFICATIONS_DATA[0];
  onPress: () => void;
}) => (
  <TouchableOpacity
    style={[styles.notificationCard, !notification.read && styles.unreadCard]}
    onPress={onPress}
  >
    <View
      style={[styles.notificationIcon, { backgroundColor: notification.iconBg }]}
    >
      <Ionicons
        name={notification.icon as any}
        size={24}
        color={notification.iconColor}
      />
    </View>
    <View style={styles.notificationContent}>
      <View style={styles.notificationHeader}>
        <Text
          style={[
            styles.notificationTitle,
            !notification.read && styles.unreadTitle,
          ]}
        >
          {notification.title}
        </Text>
        {!notification.read && <View style={styles.unreadDot} />}
      </View>
      <Text style={styles.notificationMessage} numberOfLines={2}>
        {notification.message}
      </Text>
      <Text style={styles.notificationTime}>{notification.time}</Text>
    </View>
  </TouchableOpacity>
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
});