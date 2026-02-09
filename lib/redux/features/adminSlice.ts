import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminAPI } from "../../api";

interface Admin {
	_id: string;
	name: string;
	email: string;
	role: "super-admin" | "support-admin" | "compliance-officer";
	phoneNumber: string;
	createdAt: string;
}

interface DashboardStats {
	totalLoans: number;
	totalApproved: number;
	totalRejected: number;
	totalPending: number;
	totalAmount: number;
	activeApplications: number;
	completedApplications: number;
}

interface AdminState {
	admin: Admin | null;
	isLoading: boolean;
	error: string | null;
	isSuccess: boolean;
	isAuthenticated: boolean;
	dashboardStats: DashboardStats | null;
	users: any[];
	loans: any[];
	applications: any[];
}

const initialState: AdminState = {
	admin: null,
	isLoading: false,
	error: null,
	isSuccess: false,
	isAuthenticated: false,
	dashboardStats: null,
	users: [],
	loans: [],
	applications: [],
};

// Thunks
export const registerAdmin = createAsyncThunk(
	"admin/register",
	async (adminData: any, { rejectWithValue }) => {
		try {
			const response = await adminAPI.registerAdmin(adminData);
			if (response.data.token) {
				localStorage.setItem("adminToken", response.data.token);
			}
			return response.data;
		} catch (error: any) {
			console.log("Admin registration error:", error);
			return rejectWithValue(
				error.response?.data?.message || "Registration failed just now",
			);
		}
	},
);

export const loginAdmin = createAsyncThunk(
	"admin/login",
	async (credentials: any, { rejectWithValue }) => {
		try {
			const response = await adminAPI.loginAdmin(credentials);
			if (response.data.token) {
				localStorage.setItem("adminToken", response.data.token?.accessToken);
				localStorage.setItem(
					"adminRefreshToken",
					response.data.token?.refreshToken,
				);
			}
			return response.data;
		} catch (error: any) {
			return rejectWithValue(error.response?.data?.message || "Login failed");
		}
	},
);

export const verifyAdminOtp = createAsyncThunk(
	"admin/verifyOTP",
	async (otpData: { email: string; otp: string }, { rejectWithValue }) => {
		try {
			const response = await adminAPI.verifyOtp(otpData);
			if (response.data.token) {
				localStorage.setItem("adminToken", response.data.token);
			}
			return response.data;
		} catch (error: any) {
			return rejectWithValue(error.response?.data?.message || "Invalid OTP");
		}
	},
);

export const fetchAdminProfile = createAsyncThunk(
	"admin/fetchProfile",
	async (_, { rejectWithValue }) => {
		try {
			const response = await adminAPI.getAdmin();
			console.log("fetchAdminProfile response:", response);
			return response.data;
		} catch (error: any) {
			return rejectWithValue(
				error.response?.data?.message || "Failed to fetch profile",
			);
		}
	},
);

export const fetchDashboardStats = createAsyncThunk(
	"admin/fetchStats",
	async (_, { rejectWithValue }) => {
		try {
			const response = await adminAPI.getDashboardStats();
			console.log("fetchDashboardStats response:", response);
			return response.data;
		} catch (error: any) {
			return rejectWithValue(
				error.response?.data?.message || "Failed to fetch stats",
			);
		}
	},
);

export const updateLoanStatus = createAsyncThunk(
	"admin/updateLoanStatus",
	async (
		{ loanId, status }: { loanId: string; status: string },
		{ rejectWithValue },
	) => {
		try {
			const response = await adminAPI.updateLoanStatus(loanId, status);
			return response.data;
		} catch (error: any) {
			return rejectWithValue(
				error.response?.data?.message || "Failed to update status",
			);
		}
	},
);

export const toggleLoanAI = createAsyncThunk(
	"admin/toggleAI",
	async (
		{ loanId, isActive }: { loanId: string; isActive: boolean },
		{ rejectWithValue },
	) => {
		try {
			const response = await adminAPI.toggleLoanAI(loanId, isActive);
			return response.data;
		} catch (error: any) {
			return rejectWithValue(
				error.response?.data?.message || "Failed to toggle AI",
			);
		}
	},
);

export const logoutAdmin = createAsyncThunk(
	"admin/logout",
	async (_, { rejectWithValue }) => {
		try {
			const response = await adminAPI.logoutAdmin();
			if (typeof window !== "undefined") {
				localStorage.removeItem("adminToken");
				localStorage.removeItem("adminRefreshToken");
			}
			return response.data;
		} catch (error: any) {
			return rejectWithValue(error.response?.data?.message || "Logout failed");
		}
	},
);

const adminSlice = createSlice({
	name: "admin",
	initialState,
	reducers: {
		clearError: (state) => {
			state.error = null;
		},
		clearSuccess: (state) => {
			state.isSuccess = false;
		},
		setIsAuthenticated: (state, action) => {
			state.isAuthenticated = action.payload;
		},
	},
	extraReducers: (builder) => {
		// Register Admin
		builder.addCase(registerAdmin.pending, (state) => {
			state.isLoading = true;
			state.error = null;
		});
		builder.addCase(registerAdmin.fulfilled, (state, action) => {
			state.isLoading = false;
			state.admin =
				action.payload.user || action.payload.admin || action.payload;
			state.isAuthenticated = true;
			state.isSuccess = true;
		});
		builder.addCase(registerAdmin.rejected, (state, action) => {
			state.isLoading = false;
			state.error = action.payload as string;
		});

		// Login Admin
		builder.addCase(loginAdmin.pending, (state) => {
			state.isLoading = true;
			state.error = null;
		});
		builder.addCase(loginAdmin.fulfilled, (state, action) => {
			state.isLoading = false;
			state.admin =
				action.payload.user || action.payload.admin || action.payload;
			state.isAuthenticated = true;
			state.isSuccess = true;
		});
		builder.addCase(loginAdmin.rejected, (state, action) => {
			state.isLoading = false;
			state.error = action.payload as string;
		});

		// Verify OTP
		builder.addCase(verifyAdminOtp.pending, (state) => {
			state.isLoading = true;
			state.error = null;
		});
		builder.addCase(verifyAdminOtp.fulfilled, (state, action) => {
			state.isLoading = false;
			state.admin =
				action.payload.user || action.payload.admin || action.payload;
			state.isAuthenticated = true;
			state.isSuccess = true;
		});
		builder.addCase(verifyAdminOtp.rejected, (state, action) => {
			state.isLoading = false;
			state.error = action.payload as string;
		});

		// Fetch Profile
		builder.addCase(fetchAdminProfile.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(fetchAdminProfile.fulfilled, (state, action) => {
			state.isLoading = false;
			state.admin =
				action.payload?.data || action.payload?.admin || action.payload;
			state.isAuthenticated = true;
		});
		builder.addCase(fetchAdminProfile.rejected, (state, action) => {
			state.isLoading = false;
			state.error = action.payload as string;
			state.isAuthenticated = false;
		});

		// Fetch Stats
		builder.addCase(fetchDashboardStats.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(fetchDashboardStats.fulfilled, (state, action) => {
			state.isLoading = false;
			state.dashboardStats =
				action.payload.stats || action.payload || action.payload?.data;
		});
		builder.addCase(fetchDashboardStats.rejected, (state, action) => {
			state.isLoading = false;
			state.error = action.payload as string;
		});

		// Update Loan Status
		builder.addCase(updateLoanStatus.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(updateLoanStatus.fulfilled, (state, action) => {
			state.isLoading = false;
			state.isSuccess = true;
		});
		builder.addCase(updateLoanStatus.rejected, (state, action) => {
			state.isLoading = false;
			state.error = action.payload as string;
		});

		// Toggle AI
		builder.addCase(toggleLoanAI.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(toggleLoanAI.fulfilled, (state, action) => {
			state.isLoading = false;
			state.isSuccess = true;
		});
		builder.addCase(toggleLoanAI.rejected, (state, action) => {
			state.isLoading = false;
			state.error = action.payload as string;
		});

		// Logout
		builder.addCase(logoutAdmin.fulfilled, (state) => {
			state.admin = null;
			state.isAuthenticated = false;
		});
	},
});

export const { clearError, clearSuccess, setIsAuthenticated } =
	adminSlice.actions;
export default adminSlice.reducer;
