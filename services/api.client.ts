import api from "../services/api";
import {
    ActivityTimeline,
    AnalyticsStats,
    CreatePatientRequest,
    DashboardMetrics,
    DoctorAnalytics,
    LoginRecord,
    ModelPerformance,
    Notification,
    Patient,
    PatientAnalytics,
    Scan,
    ScanResultStatistics,
    UpdateNotificationRequest,
    User,
    UserActivity,
} from "../types/api";

/**
 * Users API
 */
export const usersAPI = {
  getMe: async (): Promise<{ data: User }> => {
    const response = await api.get<User>("/users/me");
    return { data: response.data };
  },

  updateProfile: async (data: {
    name?: string;
    phone?: string;
    specialization?: string;
    avatarUrl?: string;
  }): Promise<User> => {
    const response = await api.put<User>("/users/profile", data);
    return response.data;
  },

  /**
   * PATIENT-SPECIFIC: Get patient's profile
   * Requires PATIENT role
   */
  getPatientProfile: async (): Promise<any> => {
    const response = await api.get("/users/patient-profile");
    return response.data;
  },

  /**
   * PATIENT-SPECIFIC: Update patient's profile
   * Requires PATIENT role
   */
  updatePatientProfile: async (data: {
    name?: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: string;
    bloodType?: string;
    medicalHistory?: string;
    emergencyContact?: {
      name?: string;
      phone?: string;
      relationship?: string;
    };
  }): Promise<any> => {
    const response = await api.put("/users/patient-profile", data);
    return response.data;
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

  update: async (
    id: string,
    data: Partial<CreatePatientRequest>,
  ): Promise<Patient> => {
    const response = await api.put<Patient>(`/patients/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/patients/${id}`);
  },

  search: async (query: string): Promise<Patient[]> => {
    const response = await api.get<Patient[]>("/patients", {
      params: { search: query },
    });
    return response.data;
  },

  /**
   * ADMIN ONLY: Link a clinical patient record to a registered user account.
   * Once linked, scan result notifications will be delivered to that user.
   */
  linkToUser: async (patientId: string, userId: string): Promise<Patient> => {
    const response = await api.patch<Patient>(`/patients/${patientId}/link-user`, { userId });
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

  update: async (
    id: string,
    data: { result?: string; notes?: string },
  ): Promise<Scan> => {
    const response = await api.patch<Scan>(`/scans/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/scans/${id}`);
  },

  /**
   * PATIENT-SPECIFIC: Get patient's own scans
   * Returns scans with patient-safe fields only
   * Requires PATIENT role
   */
  getMyScans: async (): Promise<any> => {
    const response = await api.get("/scans/patient/my-scans/list");
    return response.data;
  },

  /**
   * PATIENT-SPECIFIC: Get single scan with patient-safe fields
   * Hides raw images, heatmaps, and technical details
   * Requires PATIENT role
   */
  getScanPatientView: async (scanId: string): Promise<any> => {
    const response = await api.get(`/scans/patient/${scanId}/view`);
    return response.data;
  },

  /**
   * PATIENT-SPECIFIC: Update patient notes on scan
   * Allows patient to add personal observations
   * Requires PATIENT role
   */
  updatePatientNotes: async (scanId: string, notes: string): Promise<any> => {
    const response = await api.patch(`/scans/patient/${scanId}/notes`, {
      notes,
    });
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

  getDashboard: async (): Promise<DashboardMetrics> => {
    const response = await api.get<DashboardMetrics>("/analytics/dashboard");
    return response.data;
  },

  getScanResults: async (params?: {
    dateFrom?: string;
    dateTo?: string;
    groupBy?: "day" | "week" | "month";
  }): Promise<ScanResultStatistics> => {
    const response = await api.get<ScanResultStatistics>(
      "/analytics/scans/results",
      {
        params,
      },
    );
    return response.data;
  },

  getPatientAnalytics: async (): Promise<PatientAnalytics> => {
    const response = await api.get<PatientAnalytics>("/analytics/patients");
    return response.data;
  },

  getDoctorAnalytics: async (): Promise<DoctorAnalytics> => {
    const response = await api.get<DoctorAnalytics>("/analytics/doctors");
    return response.data;
  },

  getModelPerformance: async (): Promise<ModelPerformance> => {
    const response = await api.get<ModelPerformance>(
      "/analytics/model-performance",
    );
    return response.data;
  },

  getActivityTimeline: async (params?: {
    userId?: string;
    dateFrom?: string;
    dateTo?: string;
    type?: string;
  }): Promise<ActivityTimeline> => {
    const response = await api.get<ActivityTimeline>(
      "/analytics/activity-timeline",
      {
        params,
      },
    );
    return response.data;
  },

  getSystemStatus: async (): Promise<{
    aiModel: string;
    database: string;
    storage: string;
  }> => {
    const response = await api.get("/dashboard/system-status");
    return response.data;
  },
};

/**
 * Notifications API
 */
export const notificationsAPI = {
  getAll: async (): Promise<Notification[]> => {
    const response = await api.get<Notification[]>("/notifications");
    return Array.isArray(response.data) ? response.data : [];
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

/**
 * Messages API
 */
export const messagesAPI = {
  send: async (subject: string, message: string): Promise<void> => {
    await api.post("/messages/send", {
      subject,
      message,
    });
  },

  getAll: async (params?: {
    skip?: number;
    take?: number;
    responded?: boolean;
  }): Promise<any[]> => {
    const response = await api.get<any[]>("/messages", { params });
    return Array.isArray(response.data) ? response.data : [];
  },

  markAsResponded: async (id: string): Promise<void> => {
    await api.patch(`/messages/${id}`, {
      responded: true,
    });
  },
};

/**
 * Activity API
 */
export const activityAPI = {
  getHistory: async (): Promise<UserActivity> => {
    const response = await api.get<UserActivity>("/users/activity");
    return response.data;
  },

  getLoginHistory: async (): Promise<LoginRecord[]> => {
    const response = await api.get<LoginRecord[]>("/users/activity/login");
    return Array.isArray(response.data) ? response.data : [];
  },
};
