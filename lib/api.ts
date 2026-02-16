/**
 * API Integration Layer
 * Centralized axios instance with all backend API endpoints
 * Connects to backend running on port 8001
 * Supports 40+ endpoints across auth, loans, chat, admin, guest chat
 */

import axios, { AxiosInstance, AxiosError } from "axios";

// API Base URL - Change based on environment
// const API_BASE_URL = process.env.BACKEND_URL || "http://localhost:8001";
const API_BASE_URL = process.env.BACKEND_URL || "http://localhost:8001";
// "https://loan-web-app-node-js-backend.onrender.com";

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds timeout
  // timeout: 15000, // 15 seconds timeout for all requests
  // timeout: 60000, // 60 seconds timeout for all requests
});

// Interceptor to add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      // const token = localStorage.getItem("token");
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

// Interceptor to handle errors globally
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error: AxiosError) => {
//     // Handle 401 Unauthorized - redirect to login
//     if (error.response?.status === 401) {
//       if (typeof window !== "undefined") {
//         localStorage.removeItem("token");
//         window.location.href = "/login";
//       }
//     }
//     return Promise.reject(error);
//   },
// );

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;

        // 1. Clear the relevant tokens
        // It's safer to clear both if you're using different keys,
        // or just 'token' if shared.
        localStorage.removeItem("token");
        localStorage.removeItem("admin_token");

        // 2. Check if the user is currently in the admin section
        if (currentPath.startsWith("/admin")) {
          window.location.href = "/admin/auth/login-admin";
        } else {
          // Otherwise, send to standard user login
          // window.location.href = "/login";
          if (error.response?.status === 401) {
            if (typeof window !== "undefined") {
              // localStorage.removeItem("token");
              // window.location.href = "/login";
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
  getNotifications: () => apiClient.get("/api/users/notifications"),
  markNotificationAsRead: (notificationId: string) =>
    apiClient.patch(`/api/users/notifications/${notificationId}/read`),
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
  getLoanCalculator: (amount: number, months: number, rate: number) =>
    apiClient.get("/api/loans/calculator", {
      params: { amount, months, rate },
    }),
  submitApplication: (loanId: string, applicationData: any) =>
    apiClient.post(`/api/loans/${loanId}/apply`, applicationData),
  getApplicationStatus: (applicationId: string) =>
    apiClient.get(`/api/loans/applications/${applicationId}`),
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
  deleteUserCompletely: (userId: string) =>
    apiClient.delete(`/api/admin/users/${userId}/complete`),
  // toggleLoanAI: (loanId: string) =>
  //   apiClient.patch(`/api/admin/loans/${loanId}/toggle-ai`),
  toggleLoanAI: (loanId: string, isActive: boolean) =>
    apiClient.patch(`/api/admin/loans/${loanId}/toggle-ai`, { isActive }),
  getAllUsers: () => apiClient.get("/api/admin/users"),
  getAllLoans: async () => {
    const response = await apiClient.get("/api/admin/loans");
    return response.data.loans;
  },
  getApplications: () => apiClient.get("/api/admin/applications"),
  updateApplicationStatus: (applicationId: string, status: string) =>
    apiClient.patch(`/api/admin/applications/${applicationId}`, { status }),
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
