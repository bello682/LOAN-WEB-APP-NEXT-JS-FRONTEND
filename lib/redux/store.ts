import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import chatReducer from "./features/chatSlice";
import guestChatReducer from "./features/guestChatSlice";
import loanReducer from "./features/loanSlice";
import adminReducer from "./features/adminSlice";

export const store = configureStore({
	reducer: {
		auth: authReducer,
		chat: chatReducer,
		guestChat: guestChatReducer,
		loans: loanReducer,
		admin: adminReducer,
	},
});

// Types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
