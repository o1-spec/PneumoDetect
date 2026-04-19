import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { adminAPI } from "../../../services/api.client";
import { getErrorMessage } from "../../../utils/errorHandler";

export default function UsersScreen() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | "CLINICIAN" | "ADMIN">(
    "all",
  );
  const [showAddModal, setShowAddModal] = useState(false);

  // Load users when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadUsers();
    }, []),
  );

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getAllUsers();
      setUsers(data);
    } catch (err) {
      Alert.alert("Error", getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const data = await adminAPI.getAllUsers();
      setUsers(data);
    } catch (err) {
      Alert.alert("Error", getErrorMessage(err));
    } finally {
      setRefreshing(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleToggleStatus = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    Alert.alert(
      "Change User Status",
      `Are you sure you want to ${newStatus === "ACTIVE" ? "activate" : "suspend"} this user?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              await adminAPI.toggleUserStatus(userId);
              setUsers((prev) =>
                prev.map((u) =>
                  u.id === userId
                    ? { ...u, isActive: newStatus === "ACTIVE" }
                    : u,
                ),
              );
              Alert.alert("Success", `User status changed to ${newStatus}`);
            } catch (err) {
              Alert.alert("Error", getErrorMessage(err));
            }
          },
        },
      ],
    );
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    Alert.alert(
      "Delete User",
      `Are you sure you want to delete ${userName}? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await adminAPI.deleteUser(userId);
              setUsers((prev) => prev.filter((u) => u.id !== userId));
              Alert.alert("Success", "User deleted successfully");
            } catch (err) {
              Alert.alert("Error", getErrorMessage(err));
            }
          },
        },
      ],
    );
  };

  const resetAddUserForm = () => {
    setShowAddModal(false);
  };

  const renderUserCard = ({ item }: { item: any }) => (
    <View style={styles.userCard}>
      <View style={styles.userHeader}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={32} color="#0066CC" />
        </View>
        <View style={styles.userInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.userName}>{item.name}</Text>
            <View
              style={[
                styles.statusBadge,
                item.isActive ? styles.statusActive : styles.statusInactive,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  item.isActive
                    ? styles.statusTextActive
                    : styles.statusTextInactive,
                ]}
              >
                {item.isActive ? "ACTIVE" : "SUSPENDED"}
              </Text>
            </View>
          </View>
          <Text style={styles.userEmail}>{item.email}</Text>
          <View style={styles.roleContainer}>
            <Ionicons
              name={item.role === "ADMIN" ? "shield-checkmark" : "medical"}
              size={14}
              color="#0066CC"
            />
            <Text style={styles.roleText}>
              {item.role === "ADMIN" ? "Administrator" : "Clinician"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            handleToggleStatus(item.id, item.isActive ? "ACTIVE" : "SUSPENDED")
          }
        >
          <Ionicons
            name={item.isActive ? "pause-circle" : "play-circle"}
            size={20}
            color="#0066CC"
          />
          <Text style={styles.actionButtonText}>
            {item.isActive ? "Suspend" : "Activate"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteUser(item.id, item.name)}
        >
          <Ionicons name="trash-outline" size={20} color="#D32F2F" />
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
            <Text style={styles.headerTitle}>User Management</Text>
            <Text style={styles.headerSubtitle}>
              {filteredUsers.length}{" "}
              {filteredUsers.length === 1 ? "user" : "users"}
            </Text>
          </View>
          <View style={styles.addButton} />
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#8E8E93"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          placeholderTextColor="#8E8E93"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color="#8E8E93" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filterRole === "all" && styles.filterButtonActive,
          ]}
          onPress={() => setFilterRole("all")}
        >
          <Text
            style={[
              styles.filterButtonText,
              filterRole === "all" && styles.filterButtonTextActive,
            ]}
          >
            All ({users.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filterRole === "CLINICIAN" && styles.filterButtonActive,
          ]}
          onPress={() => setFilterRole("CLINICIAN")}
        >
          <Text
            style={[
              styles.filterButtonText,
              filterRole === "CLINICIAN" && styles.filterButtonTextActive,
            ]}
          >
            Clinicians ({users.filter((u) => u.role === "CLINICIAN").length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filterRole === "ADMIN" && styles.filterButtonActive,
          ]}
          onPress={() => setFilterRole("ADMIN")}
        >
          <Text
            style={[
              styles.filterButtonText,
              filterRole === "ADMIN" && styles.filterButtonTextActive,
            ]}
          >
            Admins ({users.filter((u) => u.role === "ADMIN").length})
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066CC" />
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          renderItem={renderUserCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={64} color="#C7C7CC" />
              <Text style={styles.emptyText}>No users found</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

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
    color: "#8E8E93",
    marginTop: 2,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#0066CC",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#0066CC",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    margin: 16,
    marginBottom: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    height: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1C1C1E",
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#E5E5EA",
  },
  filterButtonActive: {
    backgroundColor: "#0066CC",
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8E8E93",
  },
  filterButtonTextActive: {
    color: "#FFFFFF",
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  userCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  userHeader: {
    flexDirection: "row",
    marginBottom: 16,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1C1C1E",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: "#E8F5E9",
  },
  statusInactive: {
    backgroundColor: "#FFEBEE",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  statusTextActive: {
    color: "#4CAF50",
  },
  statusTextInactive: {
    color: "#D32F2F",
  },
  userEmail: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 6,
  },
  roleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  roleText: {
    fontSize: 12,
    color: "#0066CC",
    fontWeight: "600",
  },
  statsRow: {
    flexDirection: "row",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#F5F5F7",
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#8E8E93",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#E5E5EA",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F7",
    borderRadius: 8,
    paddingVertical: 10,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0066CC",
  },
  deleteButton: {
    backgroundColor: "#FFEBEE",
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#D32F2F",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#8E8E93",
    marginTop: 16,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  modalTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F5F5F7",
    justifyContent: "center",
    alignItems: "center",
  },
  modalForm: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F7",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    gap: 12,
  },
  modalInput: {
    flex: 1,
    fontSize: 16,
    color: "#1C1C1E",
  },
  roleSelection: {
    flexDirection: "row",
    gap: 12,
  },
  roleOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F7",
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  roleOptionActive: {
    backgroundColor: "#0066CC",
    borderColor: "#0066CC",
  },
  roleOptionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0066CC",
  },
  roleOptionTextActive: {
    color: "#FFFFFF",
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#E3F2FD",
    borderRadius: 12,
    padding: 12,
    gap: 8,
    marginTop: 4,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#0066CC",
    lineHeight: 18,
  },
  modalActions: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#F5F5F7",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#8E8E93",
  },
  submitButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#0066CC",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#0066CC",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
