import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { guestChatAPI } from "../../api";

interface GuestAttachment {
	url: string;
	filename?: string;
	contentType?: string;
}

interface GuestMessage {
	_id: string;
	applicationId: string;
	text: string;
	senderType: "user" | "admin" | "ai-bot" | "system";
	senderName?: string;
	senderEmail?: string;
	attachments?: GuestAttachment[];
	createdAt: string;
	messageType?: "text" | "file" | "action-required";
}

interface GuestSession {
	sessionToken: string;
	guestId: string;
	guest: {
		fullName: string;
		email: string;
		loanAmount?: number;
	};
}

interface GuestChatState {
	session: GuestSession | null;
	messages: GuestMessage[];
	loading: boolean;
	error: string | null;
	escalationInProgress: boolean;
}

const initialState: GuestChatState = {
	session: null,
	messages: [],
	loading: false,
	error: null,
	escalationInProgress: false,
};

// ============ INIT GUEST CHAT ============
export const initGuestChat = createAsyncThunk(
	"guestChat/init",
	async (
		payload: {
			fullName: string;
			email: string;
			loanAmount?: number;
		},
		{ rejectWithValue },
	) => {
		try {
			const response = await guestChatAPI.initGuestChat(payload);
			return response.data;
		} catch (error: any) {
			console.error("Guest Chat Init Error:", error);
			return rejectWithValue(error.response?.data || "An error occurred");
		}
	},
);

// ============ SEND GUEST MESSAGE ============
export const sendGuestMessage = createAsyncThunk(
	"guestChat/sendMessage",
	async (
		payload: {
			sessionToken: string;
			text: string;
			senderType: string;
			senderEmail: string;
			fileAttachments?: File[];
		},
		{ rejectWithValue },
	) => {
		try {
			const formData = new FormData();
			formData.append("sessionToken", payload.sessionToken);
			formData.append("text", payload.text);
			formData.append("senderType", payload.senderType);
			formData.append("senderEmail", payload.senderEmail);

			if (payload.fileAttachments) {
				payload.fileAttachments.forEach((file) => {
					formData.append("files", file);
				});
			}

			const response = await guestChatAPI.sendGuestMessage(formData);
			return response.data;
		} catch (error: any) {
			return rejectWithValue(error.response?.data || "Failed to send message");
		}
	},
);

// ============ FETCH GUEST MESSAGES ============
export const fetchGuestMessages = createAsyncThunk(
	"guestChat/fetchMessages",
	async (sessionToken: string, { rejectWithValue }) => {
		try {
			const response = await guestChatAPI.fetchGuestMessages(sessionToken);
			return response.data;
		} catch (error: any) {
			return rejectWithValue(error.response?.data || "Failed to fetch messages");
		}
	},
);

// ============ ESCALATE TO HUMAN ============
export const escalateToHuman = createAsyncThunk(
	"guestChat/escalate",
	async (sessionToken: string, { rejectWithValue }) => {
		try {
			const response = await guestChatAPI.escalateToHuman({ sessionToken });
			return response.data;
		} catch (error: any) {
			return rejectWithValue(
				error.response?.data || "Failed to escalate to human",
			);
		}
	},
);

// ============ GET SESSION STATUS ============
export const getGuestSessionStatus = createAsyncThunk(
	"guestChat/getSessionStatus",
	async (sessionToken: string, { rejectWithValue }) => {
		try {
			const response = await guestChatAPI.getSessionStatus(sessionToken);
			return response.data;
		} catch (error: any) {
			return rejectWithValue(
				error.response?.data || "Failed to get session status",
			);
		}
	},
);

const guestChatSlice = createSlice({
	name: "guestChat",
	initialState,
	reducers: {
		setGuestMessages: (state, action: PayloadAction<GuestMessage[]>) => {
			state.messages = action.payload;
		},
		clearGuestChat: (state) => {
			state.session = null;
			state.messages = [];
			state.error = null;
		},
		addGuestSocketMessage: (state, action: PayloadAction<GuestMessage>) => {
			const exists = state.messages.some((m) => m._id === action.payload._id);
			if (!exists) state.messages.push(action.payload);
		},
		setGuestError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},
		restoreGuestSession: (state, action: PayloadAction<GuestSession>) => {
			// Prevent restoring guest session if a registered user is present in Redux/auth
			if (typeof window !== "undefined") {
				const token = localStorage.getItem("token");
				if (token) {
					// Registered user is logged in, do not restore guest session
					state.session = null;
					return;
				}
			}
			state.session = action.payload;
		},
	},

	extraReducers: (builder) => {
		builder
			// Initialize Guest Chat
			.addCase(initGuestChat.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(initGuestChat.fulfilled, (state, action) => {
				state.loading = false;
				state.session = action.payload;
				state.messages = action.payload.messages || [];

				// Save session to localStorage
				if (typeof window !== "undefined") {
					localStorage.setItem(
						"guest_session",
						JSON.stringify(action.payload),
					);
				}
			})
			.addCase(initGuestChat.rejected, (state, action) => {
				state.loading = false;
				state.error = (action.payload as any)?.message || "Failed to init chat";
			})

			// Send Guest Message
			.addCase(sendGuestMessage.pending, (state) => {
				state.loading = true;
			})
			.addCase(sendGuestMessage.fulfilled, (state, action) => {
				state.loading = false;
				const exists = state.messages.some(
					(m) => m._id === action.payload._id,
				);
				if (!exists) state.messages.push(action.payload);
			})
			.addCase(sendGuestMessage.rejected, (state, action) => {
				state.loading = false;
				state.error = (action.payload as any)?.message || "Failed to send";
			})

			// Fetch Guest Messages
			.addCase(fetchGuestMessages.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchGuestMessages.fulfilled, (state, action) => {
				state.loading = false;
				const incomingMessages = action.payload;
				if (
					JSON.stringify(state.messages) !== JSON.stringify(incomingMessages)
				) {
					state.messages = incomingMessages;
				}
			})
			.addCase(fetchGuestMessages.rejected, (state, action) => {
				state.loading = false;
				state.error = (action.payload as any)?.message || "Failed to fetch";
			})

			// Escalate to Human
			.addCase(escalateToHuman.pending, (state) => {
				state.escalationInProgress = true;
			})
			.addCase(escalateToHuman.fulfilled, (state, action) => {
				state.escalationInProgress = false;
			})
			.addCase(escalateToHuman.rejected, (state, action) => {
				state.escalationInProgress = false;
				state.error =
					(action.payload as any)?.message || "Failed to escalate";
			})

			// Get Session Status
			.addCase(getGuestSessionStatus.fulfilled, (state, action) => {
				if (state.session) {
					state.session = { ...state.session, ...action.payload };
				}
			});
	},
});

export const {
	setGuestMessages,
	clearGuestChat,
	addGuestSocketMessage,
	setGuestError,
	restoreGuestSession,
} = guestChatSlice.actions;

export default guestChatSlice.reducer;
