

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { chatAPI } from "../../api";

interface Attachment {
	url: string;
	filename?: string;
	contentType?: string;
}

interface Message {
	_id: string;
	applicationId: string;
	text: string;
	senderType: "user" | "admin" | "ai-bot" | "system";
	senderName?: string;
	senderEmail?: string;
	attachments?: Attachment[];
	createdAt: string;
	readBy?: string[];
	messageType?: "text" | "file" | "action-required";
}

interface Application {
	_id: string;
	amount?: number;
	term?: number;
	monthly?: number;
	upfront?: number;
	status?: string;
	clientLastTyped?: string;
	adminLastTyped?: string;
	lastMessageAt?: string;
}

interface ChatUser {
	name: string;
	email: string;
	role: "user" | "admin";
}

interface ChatState {
	application: Application | null;
	messages: Message[];
	user: ChatUser | null;
	loading: boolean;
	error: string | null;
	typing: {
		userTyping: boolean;
		adminTyping: boolean;
	};
}

const initialState: ChatState = {
	application: null,
	messages: [],
	user: null,
	loading: false,
	error: null,
	typing: {
		userTyping: false,
		adminTyping: false,
	},
};

// ============ INIT CHAT (Registered Users) ============
export const initChat = createAsyncThunk(
	"chat/init",
	async (
		payload: {
			email: string;
			name: string;
			loanData?: any;
			role: string;
		},
		{ rejectWithValue },
	) => {
		try {
			const response = await chatAPI.initChat(payload);
			return { application: response.data.application, user: payload };
		} catch (error: any) {
			console.error("Init Chat Error:", error);
			return rejectWithValue(error.response?.data || "An error occurred");
		}
	},
);

// ============ SEND MESSAGE (Registered Users) ============
export const sendMessage = createAsyncThunk(
	"chat/sendMessage",
	async (
		payload: {
			applicationId: string;
			text: string;
			senderType: string;
			email: string;
			fileAttachments?: File[];
		},
		{ rejectWithValue },
	) => {
		try {
			const formData = new FormData();
			formData.append("applicationId", payload.applicationId);
			formData.append("text", payload.text);
			formData.append("senderType", payload.senderType);
			formData.append("email", payload.email);

			if (payload.fileAttachments) {
				payload.fileAttachments.forEach((file) => {
					formData.append("files", file);
				});
			}

			const response = await chatAPI.sendMessage(formData);
			return response.data;
		} catch (error: any) {
			return rejectWithValue(error.response?.data || "Failed to send");
		}
	},
);

// ============ FETCH MESSAGES (Registered Users) ============
export const fetchMessages = createAsyncThunk(
	"chat/fetchMessages",
	async (applicationId: string, { rejectWithValue }) => {
		try {
			const response = await chatAPI.fetchMessages(applicationId);
			return response.data;
		} catch (error: any) {
			return rejectWithValue(
				error.response?.data || "Failed to fetch messages",
			);
		}
	},
);

// ============ FETCH ALL APPLICATIONS ============
export const fetchAllApplications = createAsyncThunk(
	"chat/fetchAllApplications",
	async (_, { rejectWithValue }) => {
		try {
			const response = await chatAPI.fetchAllApplications();
			return response.data;
		} catch (error: any) {
			return rejectWithValue(
				error.response?.data || "Failed to fetch applications",
			);
		}
	},
);

// ============ UPDATE APPLICATION STATUS ============
export const updateApplicationStatus = createAsyncThunk(
	"chat/updateApplicationStatus",
	async (
		payload: { applicationId: string; status: string },
		{ rejectWithValue },
	) => {
		try {
			const response = await chatAPI.updateApplicationStatus(
				payload.applicationId,
				payload.status,
			);
			return response.data;
		} catch (error: any) {
			return rejectWithValue(
				error.response?.data || "Failed to update status",
			);
		}
	},
);

// ============ MARK MESSAGE AS READ ============
export const markMessageRead = createAsyncThunk(
	"chat/markMessageRead",
	async (
		payload: { applicationId: string; messageId: string; readerEmail: string },
		{ rejectWithValue },
	) => {
		try {
			const response = await chatAPI.markMessageRead(payload);
			return response.data;
		} catch (error: any) {
			return rejectWithValue(error.response?.data || "Failed to mark read");
		}
	},
);

const chatSlice = createSlice({
	name: "chat",
	initialState,
	reducers: {
		setMessages: (state, action: PayloadAction<Message[]>) => {
			state.messages = action.payload;
		},
		clearChat: (state) => {
			state.application = null;
			state.messages = [];
			state.user = null;
			state.typing = { userTyping: false, adminTyping: false };
			state.error = null;
		},
		setTyping: (
			state,
			action: PayloadAction<{ userTyping?: boolean; adminTyping?: boolean }>,
		) => {
			state.typing = { ...state.typing, ...action.payload };
		},
		addSocketMessage: (state, action: PayloadAction<Message>) => {
			const exists = state.messages.some((m) => m._id === action.payload._id);
			if (!exists) state.messages.push(action.payload);
		},
		updateApplication: (state, action: PayloadAction<Application>) => {
			state.application = action.payload;
		},
		setChatError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload;
		},
	},

	extraReducers: (builder) => {
		builder
			// Init Chat
			.addCase(initChat.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(initChat.fulfilled, (state, action) => {
				state.application = action.payload.application;
				state.user = action.payload.user as any;
				state.loading = false;

				if (typeof window !== "undefined") {
					localStorage.setItem(
						"chat_user",
						JSON.stringify(action.payload.user),
					);
				}
			})
			.addCase(initChat.rejected, (state, action) => {
				state.loading = false;
				state.error = (action.payload as any)?.message || "Failed to init chat";
			})

			// Send Message
			.addCase(sendMessage.pending, (state) => {
				state.loading = true;
			})
			.addCase(sendMessage.fulfilled, (state, action) => {
				state.loading = false;
				const exists = state.messages.some((m) => m._id === action.payload._id);
				if (!exists) state.messages.push(action.payload);
			})
			.addCase(sendMessage.rejected, (state, action) => {
				state.loading = false;
				state.error = (action.payload as any)?.message || "Failed to send";
			})

			// Fetch Messages
			.addCase(fetchMessages.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchMessages.fulfilled, (state, action) => {
				state.loading = false;
				const incomingMessages = action.payload;
				if (
					JSON.stringify(state.messages) !== JSON.stringify(incomingMessages)
				) {
					state.messages = incomingMessages;
				}
			})
			.addCase(fetchMessages.rejected, (state, action) => {
				state.loading = false;
				state.error = (action.payload as any)?.message || "Failed to fetch";
			})

			// Fetch All Applications
			.addCase(fetchAllApplications.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchAllApplications.fulfilled, (state, action) => {
				state.loading = false;
			})
			.addCase(fetchAllApplications.rejected, (state, action) => {
				state.loading = false;
				state.error = (action.payload as any)?.message || "Failed to fetch";
			})

			// Update Application Status
			.addCase(updateApplicationStatus.pending, (state) => {
				state.loading = true;
			})
			.addCase(updateApplicationStatus.fulfilled, (state, action) => {
				state.loading = false;
				if (state.application) {
					state.application = { ...state.application, ...action.payload };
				}
			})
			.addCase(updateApplicationStatus.rejected, (state, action) => {
				state.loading = false;
				state.error = (action.payload as any)?.message || "Failed to update";
			})

			// Mark Message Read
			.addCase(markMessageRead.fulfilled, (state, action) => {
				const { messageId, readerEmail } = action.payload;
				const msg = state.messages.find((m) => m._id === messageId);
				if (msg) {
					if (!msg.readBy) msg.readBy = [];
					if (!msg.readBy.includes(readerEmail)) msg.readBy.push(readerEmail);
				}
			})
			.addCase(markMessageRead.rejected, (state, action) => {
				state.error = (action.payload as any)?.message || "Failed to mark read";
			});
	},
});

export const {
	setMessages,
	clearChat,
	setTyping,
	addSocketMessage,
	updateApplication,
	setChatError,
} = chatSlice.actions;

export default chatSlice.reducer;
