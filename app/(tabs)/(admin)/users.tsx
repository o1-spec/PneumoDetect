import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Mock user data
const MOCK_USERS = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@hospital.com",
    role: "Clinician",
    scansCount: 24,
    lastActive: "2024-02-17",
    status: "active",
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    email: "michael.chen@hospital.com",
    role: "Clinician",
    scansCount: 18,
    lastActive: "2024-02-16",
    status: "active",
  },
  {
    id: "3",
    name: "Admin User",
    email: "admin@pneumoscan.ai",
    role: "Admin",
    scansCount: 156,
    lastActive: "2024-02-17",
    status: "active",
  },
  {
    id: "4",
    name: "Dr. Emily Rodriguez",
    email: "emily.r@hospital.com",
    role: "Clinician",
    scansCount: 42,
    lastActive: "2024-02-15",
    status: "active",
  },
  {
    id: "5",
    name: "Dr. James Wilson",
    email: "j.wilson@hospital.com",
    role: "Clinician",
    scansCount: 8,
    lastActive: "2024-02-10",
    status: "inactive",
  },
];

export default function UsersScreen() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | "Clinician" | "Admin">(
    "all",
  );

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleDeleteUser = (userId: string, userName: string) => {
    Alert.alert(
      "Delete User",
      `Are you sure you want to delete ${userName}? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setUsers(users.filter((u) => u.id !== userId));
            Alert.alert("Success", "User deleted successfully");
          },
        },
      ],
    );
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(
      users.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === "active" ? "inactive" : "active" }
          : u,
      ),
    );
  };

  const renderUserCard = ({ item }: { item: (typeof MOCK_USERS)[0] }) => (
    <View style={styles.userCard}>
      {/* User Avatar & Info */}
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
                item.status === "active"
                  ? styles.statusActive
                  : styles.statusInactive,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  item.status === "active"
                    ? styles.statusTextActive
                    : styles.statusTextInactive,
                ]}
              >
                {item.status}
              </Text>
            </View>
          </View>
          <Text style={styles.userEmail}>{item.email}</Text>
          <View style={styles.roleContainer}>
            <Ionicons
              name={item.role === "Admin" ? "shield-checkmark" : "medical"}
              size={14}
              color="#0066CC"
            />
            <Text style={styles.roleText}>{item.role}</Text>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.scansCount}</Text>
          <Text style={styles.statLabel}>Scans</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.lastActive}</Text>
          <Text style={styles.statLabel}>Last Active</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleToggleStatus(item.id)}
        >
          <Ionicons
            name={item.status === "active" ? "pause-circle" : "play-circle"}
            size={20}
            color="#0066CC"
          />
          <Text style={styles.actionButtonText}>
            {item.status === "active" ? "Deactivate" : "Activate"}
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
            <Text style={styles.headerTitle}>User Management</Text>
            <Text style={styles.headerSubtitle}>
              {filteredUsers.length}{" "}
              {filteredUsers.length === 1 ? "user" : "users"}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => Alert.alert("Add User", "Feature coming soon")}
          >
            <Ionicons name="person-add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
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

      {/* Filter Buttons */}
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
            filterRole === "Clinician" && styles.filterButtonActive,
          ]}
          onPress={() => setFilterRole("Clinician")}
        >
          <Text
            style={[
              styles.filterButtonText,
              filterRole === "Clinician" && styles.filterButtonTextActive,
            ]}
          >
            Clinicians ({users.filter((u) => u.role === "Clinician").length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filterRole === "Admin" && styles.filterButtonActive,
          ]}
          onPress={() => setFilterRole("Admin")}
        >
          <Text
            style={[
              styles.filterButtonText,
              filterRole === "Admin" && styles.filterButtonTextActive,
            ]}
          >
            Admins ({users.filter((u) => u.role === "Admin").length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* User List */}
      <FlatList
        data={filteredUsers}
        renderItem={renderUserCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color="#C7C7CC" />
            <Text style={styles.emptyText}>No users found</Text>
          </View>
        }
      />
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
});
