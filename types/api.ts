/**
 * API Types and Interfaces
 */

// ============== AUTH ==============
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role?: "CLINICIAN" | "PATIENT";
  specialization?: string;
  phone?: string;
  dateOfBirth?: string; // For patients
  gender?: "MALE" | "FEMALE" | "OTHER";
  medicalHistory?: string;
}

export interface AuthResponse extends User {
  accessToken: string;
}

// ============== USER ==============
export interface User {
  id: string;
  email: string;
  name: string;
  role: "CLINICIAN" | "PATIENT";
  specialization?: string; // Clinician only
  phone?: string;
  dateOfBirth?: string; // Patient only
  gender?: "MALE" | "FEMALE" | "OTHER"; // Patient only
  medicalHistory?: string; // Patient only
  avatarUrl?: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  specialization?: string; // Clinician only
  dateOfBirth?: string; // Patient only
  gender?: "MALE" | "FEMALE" | "OTHER"; // Patient only
  medicalHistory?: string; // Patient only
  avatarUrl?: string;
}

// ============== PATIENT ==============
export interface Patient {
  id: string;
  idNumber: string; // Unique identifier
  name: string;
  age: number;
  gender: "MALE" | "FEMALE";
  createdAt: string;
  updatedAt: string;
  scans?: Scan[];
}

export interface CreatePatientRequest {
  idNumber: string;
  name: string;
  age: number;
  gender: "MALE" | "FEMALE";
}

// ============== SCAN ==============
export type ScanStatus = "UPLOADED" | "PROCESSING" | "COMPLETED" | "FAILED";
export type ScanResult = "PNEUMONIA" | "NORMAL" | "PNEUMONIA_DETECTED" | "CONCERNS";

export interface Scan {
  id: string;
  imageUrl?: string;
  heatmapUrl?: string;
  status: ScanStatus;
  result?: ScanResult;
  confidence?: number;
  modelVersion?: string;
  createdAt: string;
  updatedAt: string;
  analyzedAt?: string; // When scan was analyzed
  patientId?: string;
  doctorId?: string;
  clinicianId?: string;
  patient?: Patient;
  doctor?: User;
  clinician?: User;
  // Patient-specific fields (from patient-safe endpoints)
  clinicianNotes?: string;
  patientNotes?: string;
  doctorName?: string; // Doctor/clinician name
  hospitalName?: string; // Hospital name
  recommendations?: string[]; // Recommendations based on result
  disclaimer?: string; // Medical disclaimer
  patientViewedAt?: string; // When patient viewed results
  isSharedWithPatient?: boolean; // Sharing permissions
}

export interface ScanUploadRequest {
  patientId: string;
  image: FormData;
}

export interface ScanProcessResponse {
  id: string;
  result: "PNEUMONIA" | "NORMAL";
  confidence: number;
  heatmapUrl?: string;
  status: "COMPLETED" | "FAILED";
}

// ============== ANALYTICS ==============
export interface AnalyticsStats {
  totalScans: number;
  completedScans: number;
  processingScans: number;
  failedScans: number;
  pneumoniaCases: number;
  normalCases: number;
  averageConfidence: number;
  recentScans: Scan[];
}

// ============== NOTIFICATION ==============
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "SCAN" | "SYSTEM" | "USER";
  read: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface UpdateNotificationRequest {
  read?: boolean;
}

// ============== ACTIVITY & LOGIN HISTORY ==============
export interface LoginRecord {
  id: string;
  userId: string;
  ipAddress: string;
  userAgent: string;
  loginAt: string;
  logoutAt?: string;
  isActive: boolean;
}

export interface UserActivity {
  recentScans: Scan[];
  recentNotifications: Notification[];
  loginHistory: LoginRecord[];
  profileUpdatedAt: string;
}

// ============== ANALYTICS ==============
export interface DashboardMetrics {
  totalScans: number;
  totalPatients: number;
  pneumoniaDetected: number;
  normalScans: number;
  accuracyRate: number;
  averageConfidence: number;
  todayMetrics: {
    scans: number;
    pneumonia: number;
    normal: number;
  };
  thisWeekMetrics: {
    scans: number;
    pneumonia: number;
    normal: number;
  };
  thisMonthMetrics: {
    scans: number;
    pneumonia: number;
    normal: number;
  };
  recentScans: Scan[];
  topPatients: Array<{
    id: string;
    name: string;
    scanCount: number;
    pneumoniaDetected: number;
  }>;
}

export interface ScanResultStatistics {
  resultBreakdown: {
    pneumonia: number;
    normal: number;
    pneumoniaPercentage: number;
    normalPercentage: number;
  };
  confidenceDistribution: {
    excellent: number; // > 0.9
    good: number; // 0.8 - 0.9
    fair: number; // < 0.8
  };
  timelineData: Array<{
    date: string;
    scans: number;
    pneumonia: number;
    normal: number;
    averageConfidence: number;
  }>;
  totalScans: number;
  averageConfidence: number;
}

export interface PatientAnalytics {
  totalPatients: number;
  newPatientsThisMonth: number;
  patientsWithPneumonia: number;
  averageScansPerPatient: number;
  topPatients: Array<{
    id: string;
    name: string;
    idNumber: string;
    scanCount: number;
    pneumoniaDetected: number;
    lastScanDate: string;
  }>;
}

export interface DoctorAnalytics {
  totalDoctors: number;
  activeDoctorsThisMonth: number;
  doctors: Array<{
    id: string;
    name: string;
    email: string;
    scanCount: number;
    pneumoniaDetected: number;
    accuracyRate: number;
    averageConfidence: number;
    lastActiveAt: string;
  }>;
}

export interface ModelPerformance {
  overallMetrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
  };
  byModelVersion: Array<{
    version: string;
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    scanCount: number;
  }>;
  confidenceThresholdAnalysis: Array<{
    threshold: number;
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
  }>;
}

export interface ActivityTimelineEvent {
  id: string;
  type: "SCAN_UPLOADED" | "USER_LOGIN" | "NOTIFICATION_SENT" | "SCAN_COMPLETED";
  timestamp: string;
  user?: User;
  scan?: Scan;
  details?: Record<string, any>;
}

export interface ActivityTimeline {
  events: ActivityTimelineEvent[];
  totalEvents: number;
  dateRange: {
    from: string;
    to: string;
  };
}

// ============== API RESPONSE ==============
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}
