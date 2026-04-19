import api from "../services/api";
import {
  AnalyticsStats,
  CreatePatientRequest,
  Notification,
  Patient,
  Scan,
  UpdateNotificationRequest,
  User,
} from "../types/api";

/**
 * Users API
 */
export const usersAPI = {
  getMe: async (): Promise<{ data: User }> => {
    const response = await api.get<User>("/users/me");
    return { data: response.data };
  },
};

/**
 * Patients API
 */
export const patientsAPI = {
  getAll: async (): Promise<Patient[]> => {
    const response = await api.get<Patient[]>("/patients");
    return response.data;
  },

  getById: async (id: string): Promise<Patient> => {
    const response = await api.get<Patient>(`/patients/${id}`);
    return response.data;
  },

  create: async (data: CreatePatientRequest): Promise<Patient> => {
    const response = await api.post<Patient>("/patients", data);
    return response.data;
  },

  search: async (query: string): Promise<Patient[]> => {
    const response = await api.get<Patient[]>("/patients", {
      params: { search: query },
    });
    return response.data;
  },
};

/**
 * Scans API
 */
export const scansAPI = {
  getAll: async (): Promise<Scan[]> => {
    const response = await api.get<Scan[]>("/scans");
    return response.data;
  },

  getByPatientId: async (patientId: string): Promise<Scan[]> => {
    const response = await api.get<Scan[]>(`/scans/patient/${patientId}`);
    return response.data;
  },

  getById: async (id: string): Promise<Scan> => {
    const response = await api.get<Scan>(`/scans/${id}`);
    return response.data;
  },

  upload: async (patientId: string, imageUri: string): Promise<Scan> => {
    const formData = new FormData();
    formData.append("patientId", patientId);
    formData.append("image", {
      uri: imageUri,
      type: "image/jpeg",
      name: `scan-${Date.now()}.jpg`,
    } as any);

    const response = await api.post<Scan>("/scans/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  process: async (scanId: string): Promise<Scan> => {
    const response = await api.post<Scan>(`/scans/${scanId}/process`);
    return response.data;
  },
};

/**
 * Analytics API
 */
export const analyticsAPI = {
  getStats: async (): Promise<AnalyticsStats> => {
    const response = await api.get<AnalyticsStats>("/analytics/stats");
    return response.data;
  },
};

/**
 * Notifications API
 */
export const notificationsAPI = {
  getAll: async (): Promise<Notification[]> => {
    const response = await api.get<Notification[]>("/notifications");
    return response.data;
  },

  getById: async (id: string): Promise<Notification> => {
    const response = await api.get<Notification>(`/notifications/${id}`);
    return response.data;
  },

  update: async (
    id: string,
    data: UpdateNotificationRequest,
  ): Promise<Notification> => {
    const response = await api.patch<Notification>(
      `/notifications/${id}`,
      data,
    );
    return response.data;
  },

  markAllAsRead: async (): Promise<void> => {
    await api.post("/notifications/mark-all-read");
  },

  // Delete notification
  delete: async (id: string): Promise<void> => {
    await api.delete(`/notifications/${id}`);
  },
};

/**
 * Admin API
 */
export const adminAPI = {
  // Get all users
  getAllUsers: async (): Promise<any[]> => {
    const response = await api.get("/admin/users");
    return response.data;
  },

  // Get user details
  getUserById: async (id: string): Promise<any> => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  // Toggle user active/inactive
  toggleUserStatus: async (id: string): Promise<any> => {
    const response = await api.patch(`/admin/users/${id}/status`);
    return response.data;
  },

  // Delete user
  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/admin/users/${id}`);
  },
};
