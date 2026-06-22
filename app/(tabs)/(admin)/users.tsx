import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useToast } from "../../../hooks/useToast";
import { adminAPI } from "../../../services/api.client";
import { getErrorMessage } from "../../../utils/errorHandler";
import { COLORS, BORDER_RADIUS, SHADOWS, SPACING } from "../../../constants/Theme";

export default function UsersScreen() {
  const insets = useSafeAreaInsets();
  const { success, error: showError } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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
      showError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const data = await adminAPI.getAllUsers();
      setUsers(data);
      success("Users refreshed");
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setRefreshing(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const isAdmin = user.role === "ADMIN";
    return matchesSearch && isAdmin;
  });

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    try {
      await adminAPI.toggleUserStatus(userId);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, isActive: newStatus === "ACTIVE" } : u,
        ),
      );
      success(`User status changed to ${newStatus}`);
    } catch (err) {
      showError(getErrorMessage(err));
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    try {
      await adminAPI.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      success("User deleted successfully");
    } catch (err) {
      showError(getErrorMessage(err));
    }
  };

  const resetAddUserForm = () => {
    setShowAddModal(false);
  };

  const renderUserCard = ({ item }: { item: any }) => (
    <View style={styles.userCard}>
      <View style={styles.userHeader}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={32} color={COLORS.primary} />
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
              color={COLORS.primary}
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
            color={COLORS.primary}
          />
          <Text style={styles.actionButtonText}>
            {item.isActive ? "Suspend" : "Activate"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteUser(item.id, item.name)}
        >
          <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top + 8 : 16 }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>User Management</Text>
            <Text style={styles.headerSubtitle}>
              {filteredUsers.length}{" "}
              {filteredUsers.length === 1 ? "user" : "users"}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push("/(tabs)/(admin)/analytics")}
          >
            <Ionicons name="bar-chart" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={COLORS.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          placeholderTextColor={COLORS.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
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
              <Ionicons name="people-outline" size={64} color={COLORS.border} />
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
  headerTextContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS.light,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    margin: 16,
    marginBottom: 12,
    paddingHorizontal: 16,
    borderRadius: BORDER_RADIUS.md,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
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
    backgroundColor: COLORS.primaryLight,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  filterButtonTextActive: {
    color: "#FFFFFF",
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  userCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.light,
  },
  userHeader: {
    flexDirection: "row",
    marginBottom: 16,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primaryLight,
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
    color: COLORS.textPrimary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: COLORS.successLight,
  },
  statusInactive: {
    backgroundColor: COLORS.dangerLight,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  statusTextActive: {
    color: COLORS.success,
  },
  statusTextInactive: {
    color: COLORS.danger,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  roleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  roleText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "600",
  },
  statsRow: {
    flexDirection: "row",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
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
    backgroundColor: COLORS.primaryLight,
    borderRadius: 8,
    paddingVertical: 10,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },
  deleteButton: {
    backgroundColor: COLORS.dangerLight,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.danger,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 16,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
    ...SHADOWS.heavy,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryLight,
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
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
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
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  roleOptionActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  roleOptionText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },
  roleOptionTextActive: {
    color: "#FFFFFF",
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    padding: 12,
    gap: 8,
    marginTop: 4,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.primary,
    lineHeight: 18,
  },
  modalActions: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textSecondary,
  },
  submitButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    ...SHADOWS.light,
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
