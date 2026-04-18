import api from "../services/api";
import {
    AnalyticsStats,
    CreatePatientRequest,
    Notification,
    Patient,
    Scan,
    UpdateNotificationRequest,
} from "../types/api";

/**
 * Patients API
 */
export const patientsAPI = {
  // Get all patients
  getAll: async (): Promise<Patient[]> => {
    const response = await api.get<Patient[]>("/patients");
    return response.data;
  },

  // Get single patient with scans
  getById: async (id: string): Promise<Patient> => {
    const response = await api.get<Patient>(`/patients/${id}`);
    return response.data;
  },

  // Create new patient
  create: async (data: CreatePatientRequest): Promise<Patient> => {
    const response = await api.post<Patient>("/patients", data);
    return response.data;
  },

  // Search patients by name or ID
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
  // Get all scans for current user
  getAll: async (): Promise<Scan[]> => {
    const response = await api.get<Scan[]>("/scans");
    return response.data;
  },

  // Get scans for a specific patient
  getByPatientId: async (patientId: string): Promise<Scan[]> => {
    const response = await api.get<Scan[]>(`/scans/patient/${patientId}`);
    return response.data;
  },

  // Get single scan
  getById: async (id: string): Promise<Scan> => {
    const response = await api.get<Scan>(`/scans/${id}`);
    return response.data;
  },

  // Upload X-ray image
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

  // Process scan with AI
  process: async (scanId: string): Promise<Scan> => {
    const response = await api.post<Scan>(`/scans/${scanId}/process`);
    return response.data;
  },
};

/**
 * Analytics API
 */
export const analyticsAPI = {
  // Get dashboard statistics
  getStats: async (): Promise<AnalyticsStats> => {
    const response = await api.get<AnalyticsStats>("/analytics/stats");
    return response.data;
  },
};

/**
 * Notifications API
 */
export const notificationsAPI = {
  // Get all notifications
  getAll: async (): Promise<Notification[]> => {
    const response = await api.get<Notification[]>("/notifications");
    return response.data;
  },

  // Get single notification
  getById: async (id: string): Promise<Notification> => {
    const response = await api.get<Notification>(`/notifications/${id}`);
    return response.data;
  },

  // Mark as read/unread
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

  // Mark all as read
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
