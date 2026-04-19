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
  role?: "CLINICIAN" | "ADMIN";
  specialization?: string;
  phone?: string;
}

export interface AuthResponse extends User {
  accessToken: string;
}

// ============== USER ==============
export interface User {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "CLINICIAN";
  specialization?: string;
  phone?: string;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  specialization?: string;
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
export type ScanResult = "PNEUMONIA" | "NORMAL";

export interface Scan {
  id: string;
  imageUrl: string;
  heatmapUrl?: string;
  status: ScanStatus;
  result?: ScanResult;
  confidence?: number;
  modelVersion?: string;
  createdAt: string;
  updatedAt: string;
  patientId: string;
  doctorId: string;
  patient?: Patient;
  doctor?: User;
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
