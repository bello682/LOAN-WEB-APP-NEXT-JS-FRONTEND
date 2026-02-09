import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { authAPI } from "../../api";

export interface User {
	_id: string;
	fullName: string;
	email: string;
	creditScore?: number;
	// Add any other fields you expect on user
}

interface AuthState {
	user: User | null;
	token: string | null;
	isLoading: boolean;
	error: string | null;
	isSuccess: boolean;
}

const initialState: AuthState = {
	user: null,
	token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
	isLoading: false,
	error: null,
	isSuccess: false,
};

export const registerUser = createAsyncThunk(
	"auth/register",
	async (userData: any, thunkAPI) => {
		try {
			const response = await authAPI.register(userData);
			if (response.data.token && typeof window !== "undefined") {
				localStorage.setItem("token", response.data.token);
				if (response.data.user) {
					localStorage.setItem("user_info", JSON.stringify(response.data.user));
					localStorage.setItem(
						"user_session",
						JSON.stringify({
							userId: response.data.user._id,
							email: response.data.user.email,
						}),
					);
				}
			}
			return response.data;
		} catch (error: any) {
			return thunkAPI.rejectWithValue(
				error.response?.data?.message || "Registration failed",
			);
		}
	},
);

export const loginUser = createAsyncThunk(
	"auth/login",
	async (userData: any, thunkAPI) => {
		try {
			const response = await authAPI.login(userData);
			if (response.data.token && typeof window !== "undefined") {
				localStorage.setItem("token", response.data.token);
				if (response.data.user) {
					localStorage.setItem("user_info", JSON.stringify(response.data.user));
					localStorage.setItem(
						"user_session",
						JSON.stringify({
							userId: response.data.user._id,
							email: response.data.user.email,
						}),
					);
				}
			}
			return response.data;
		} catch (error: any) {
			return thunkAPI.rejectWithValue(
				error.response?.data?.message || "Login failed",
			);
		}
	},
);

export const verifyOTP = createAsyncThunk(
	"auth/verifyOTP",
	async (otpData: { email: string; otp: string }, { rejectWithValue }) => {
		try {
			const response = await authAPI.verifyOtp(otpData);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response?.data?.message || "Invalid OTP");
		}
	},
);

export const resendOTP = createAsyncThunk(
	"auth/resendOTP",
	async (email: string, { rejectWithValue }) => {
		try {
			const response = await authAPI.resendOtp(email);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(err.response?.data?.message || "Failed to resend");
		}
	},
);

// 1. Forgot Password Thunk
export const forgotPassword = createAsyncThunk(
	"auth/forgotPassword",
	async (email: string, { rejectWithValue }) => {
		try {
			const response = await authAPI.forgotPassword(email);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(
				err.response?.data?.message || "Failed to send reset link",
			);
		}
	},
);

// 2. Reset Password Thunk
// Note: This usually requires a token from the URL sent to the user's email
export const resetPassword = createAsyncThunk(
	"auth/resetPassword",
	async (data: { password: any; token: string }, { rejectWithValue }) => {
		try {
			const response = await authAPI.resetPassword(data.token, data.password);
			return response.data;
		} catch (err: any) {
			return rejectWithValue(
				err.response?.data?.message || "Failed to reset password",
			);
		}
	},
);

export const getMe = createAsyncThunk("auth/getMe", async (_, thunkAPI) => {
	try {
		const response = await authAPI.getCurrentUser(); // You'll need to create this endpoint
		return response.data;
	} catch (error: any) {
		return thunkAPI.rejectWithValue("Session expired");
	}
});

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		resetAuth: (state) => {
			state.isLoading = false;
			state.isSuccess = false;
			state.error = null;
		},
		logout: (state) => {
			if (typeof window !== "undefined") {
				localStorage.removeItem("token");
				localStorage.removeItem("user_info");
				localStorage.removeItem("user_session");
			}
			state.user = null;
			state.token = null;
		},
	},
	extraReducers: (builder) => {
		builder
			// Registration
			.addCase(registerUser.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(registerUser.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.token = action.payload.token;
				state.user = action.payload.user as User;
			})
			.addCase(registerUser.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})

			// Login
			.addCase(loginUser.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.token = action.payload.token;
				state.user = action.payload.user as User;
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})

			// Verify OTP
			.addCase(verifyOTP.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(verifyOTP.fulfilled, (state) => {
				state.isLoading = false;
				state.isSuccess = true; // This triggers the redirect in your page.tsx
			})
			.addCase(verifyOTP.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})

			// Resend OTP
			.addCase(resendOTP.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(resendOTP.fulfilled, (state) => {
				state.isLoading = false;
			})
			.addCase(resendOTP.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})

			// Forgot Password
			.addCase(forgotPassword.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(forgotPassword.fulfilled, (state) => {
				state.isLoading = false;
				state.isSuccess = true;
			})
			.addCase(forgotPassword.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})

			// Reset Password
			.addCase(resetPassword.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(resetPassword.fulfilled, (state) => {
				state.isLoading = false;
				state.isSuccess = true;
			})
			.addCase(resetPassword.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})

			.addCase(getMe.fulfilled, (state, action) => {
				state.user = (action.payload.data || action.payload) as User;
				state.isLoading = false;
			});
	},
});

export const { resetAuth, logout } = authSlice.actions;
export default authSlice.reducer;
