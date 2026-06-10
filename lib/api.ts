/**
 * API Integration Layer
 * Centralized axios instance with all backend API endpoints
 * Connects to backend running on port 8001
 * Supports 40+ endpoints across auth, loans, chat, admin, guest chat
 */

import axios, { AxiosInstance, AxiosError } from "axios";

// API Base URL - Change based on environment
const API_BASE_URL =
  process.env.BACKEND_URL ||
  "https://standard-loan-management-system-backend.onrender.com";

// "http://localhost:8046";

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // timeout: 30000, // 30 seconds timeout
  // timeout: 15000, // 15 seconds timeout for all requests
  timeout: 60000, // 60 seconds timeout for all requests
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token =
        localStorage.getItem("adminToken") || localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;

        localStorage.removeItem("token");
        localStorage.removeItem("admin_token");

        if (currentPath.startsWith("/admin")) {
          window.location.href = "/admin/auth/login-admin";
        } else {
          if (error.response?.status === 401) {
            if (typeof window !== "undefined") {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }
          }
        }
      }
    }
    return Promise.reject(error);
  },
);

// ===========================
// AUTH ENDPOINTS
// ===========================
export const authAPI = {
  register: (userData: any) => apiClient.post("/api/auth/register", userData),
  login: (credentials: any) => apiClient.post("/api/auth/login", credentials),
  deleteUser: (userId: any) => apiClient.post(`/api/auth/user/${userId}`),
  kyc: (credentials: any, userId: any) =>
    apiClient.post(`/api/auth/users/${userId}/update-kyc`, credentials),
  verifyOtp: (data: { email: string; otp: string }) =>
    apiClient.post("/api/auth/verify-otp", data),
  resendOtp: (email: string) =>
    apiClient.post("/api/auth/resend-otp", { email }),
  forgotPassword: (email: string) =>
    apiClient.post("/api/auth/forgot-password", { email }),
  resetPassword: (token: string, password: string) =>
    apiClient.post(`/api/auth/reset-password/${token}`, { password }),
  logout: () => apiClient.post("/api/auth/logout"),
  getCurrentUser: () => apiClient.get("/api/auth/me"),
};

// ===========================
// USER ENDPOINTS
// ===========================
export const userAPI = {
  getProfile: () => apiClient.get("/api/users/profile"),
  updateProfile: (userData: any) =>
    apiClient.put("/api/users/profile", userData),
  getMyLoans: () => apiClient.get("/api/loans/my-loans"),
  getTransaction: (transactionId: string) =>
    apiClient.get(`/api/users/transactions/${transactionId}`),
  getNotifications: () => apiClient.get("/api/notifications/my-notifications"),
  markNotificationAsRead: (notificationId: string) =>
    apiClient.patch(`/api/notifications/${notificationId}/read`),
};

// ===========================
// LOAN ENDPOINTS
// ===========================
export const loanAPI = {
  getAllLoans: () => apiClient.get("/api/loans"),
  getLoanById: (loanId: string) => apiClient.get(`/api/loans/${loanId}`),
  createLoan: (loanData: any) => apiClient.post("/api/loans", loanData),
  updateLoan: (loanId: string, loanData: any) =>
    apiClient.put(`/api/loans/${loanId}`, loanData),
  deleteLoan: (loanId: string) => apiClient.delete(`/api/loans/${loanId}`),
  getMyLoans: () => apiClient.get("/api/loans/my-loans"),
};

// ===========================
// CHAT ENDPOINTS (Registered Users)
// ===========================
export const chatAPI = {
  initChat: (data: {
    email: string;
    name: string;
    loanData?: any;
    role: string;
  }) => apiClient.post("/api/chat/init", data),
  sendMessage: (data: FormData | any) =>
    apiClient.post("/api/chat/message", data, {
      headers:
        data instanceof FormData
          ? { "Content-Type": "multipart/form-data" }
          : { "Content-Type": "application/json" },
    }),
  fetchMessages: (applicationId: string) =>
    apiClient.get(`/api/chat/messages/${applicationId}`),
  fetchMessagesByUserId: (userId: string) =>
    apiClient.get(`/api/chat/messages/user/${userId}`),
  fetchAllApplications: () => apiClient.get("/api/chat/applications"),
  getApplications: () => apiClient.get("/api/chat/applications"),
  updateApplicationStatus: (applicationId: string, status: string) =>
    apiClient.patch(`/api/chat/applications/${applicationId}`, { status }),
  markMessageRead: (data: {
    applicationId: string;
    messageId: string;
    readerEmail: string;
  }) => apiClient.post("/api/chat/read", data),
};

// ===========================
// GUEST CHAT ENDPOINTS (No Auth Required)
// ===========================
export const guestChatAPI = {
  initGuestChat: (data: {
    fullName: string;
    email: string;
    loanAmount?: number;
  }) => apiClient.post("/api/chat/guest/init", data),
  sendGuestMessage: (data: FormData | any) =>
    apiClient.post("/api/chat/guest/message", data, {
      headers:
        data instanceof FormData
          ? { "Content-Type": "multipart/form-data" }
          : { "Content-Type": "application/json" },
    }),
  fetchGuestMessages: (sessionToken: string) =>
    apiClient.get(`/api/chat/guest/messages/${sessionToken}`),
  getSessionStatus: (sessionToken: string) =>
    apiClient.get(`/api/chat/guest/session/${sessionToken}`),
  escalateToHuman: (data: { sessionToken?: string; applicationId?: string }) =>
    apiClient.post("/api/chat/guest/escalate", data),
};

// ===========================
// ADMIN ENDPOINTS
// ===========================
export const adminAPI = {
  registerAdmin: (adminData: any) =>
    apiClient.post("/api/admin/register", adminData),
  loginAdmin: (credentials: any) =>
    apiClient.post("/api/admin/login", credentials),
  logoutAdmin: () => apiClient.post("/api/admin/logout"),
  verifyOtp: (data: { email: string; otp: string }) =>
    apiClient.post("/api/admin/verify-otp", data),
  resendOtp: (email: string) =>
    apiClient.post("/api/admin/resend-otp", { email }),
  forgotPassword: (email: string) =>
    apiClient.post("/api/admin/forgot-password", { email }),
  resetPassword: (token: string, newPassword: string) =>
    apiClient.post(`/api/admin/reset-password/${token}`, { newPassword }),
  getAdmin: () => apiClient.get("/api/admin/getAdmin"),
  getDashboardStats: () => apiClient.get("/api/admin/dashboard/stats"),
  updateLoanStatus: (loanId: string, status: string) =>
    apiClient.patch(`/api/admin/loans/${loanId}/status`, { status }),

  deleteUser: (userId: string) =>
    apiClient.delete(`/api/admin/users/${userId}`),
  toggleLoanAI: (loanId: string, isActive: boolean, isGuest: boolean) =>
    apiClient.patch(`/api/admin/loans/${loanId}/toggle-ai`, {
      isActive,
      isGuest,
    }),
  getAllLoans: async () => {
    try {
      const response = await apiClient.get("/api/admin/loans", {
        timeout: 15000, // Only wait 15 seconds for this specific call
      });
      return response.data.loans;
    } catch (error) {
      console.error("Loan API specifically failed:", error);
      throw error;
    }
  },
  getNotifications: () => apiClient.get("/api/notifications/my-notifications"),
  sendNotification: (data: {
    recipientId?: string;
    guestId?: string;
    title: string;
    message: string;
    category: string;
    scope: "individual" | "global";
  }) => apiClient.post("/api/notifications/notify", data),
};

// ===========================
// ERROR HANDLING UTILITIES
// ===========================
export const getErrorMessage = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return "An error occurred. Please try again.";
};

export const isAxiosError = (error: any): error is AxiosError => {
  return error && error.response !== undefined;
};

// ===========================
// HELPER FUNCTIONS
// ===========================

/**
 * Setup auth token after login
 */
export const setAuthToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

/**
 * Clear auth token on logout
 */
export const clearAuthToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
  delete apiClient.defaults.headers.common["Authorization"];
};

/**
 * Get current stored token
 */
export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export default apiClient;
