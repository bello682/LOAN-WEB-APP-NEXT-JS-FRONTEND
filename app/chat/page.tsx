"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  ArrowRight,
  CheckCircle2,
  Lock,
  X,
  MessageSquare,
  LogOut,
  Menu,
  Settings,
  Loader2,
  AlertCircle,
  Send,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

import io, { Socket } from "socket.io-client";
import { Navigation, Footer } from "@/app/components";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  sendGuestMessage,
  fetchGuestMessages,
  restoreGuestSession,
} from "@/lib/redux/features/guestChatSlice";
import toast from "react-hot-toast";
import GuestChatModal from "./GuestChatModal";
import { sendMessage, fetchMessages } from "@/lib/redux/features/chatSlice";
import { getMe } from "@/lib/redux/features/authSlice";
import { guestChatAPI, chatAPI, userAPI } from "@/lib/api";
import { AxiosError } from "axios";

// Helper to fetch user's loan using userAPI.getMyLoans
async function fetchUserLoan() {
  // Safety check: ensure the API object exists before calling its methods
  if (!userAPI) {
    console.error("userAPI is not initialized.");
    return null;
  }

  try {
    const res = await userAPI.getMyLoans();

    // Check for the preferred structure: res.data.loans
    if (
      res?.data?.loans &&
      Array.isArray(res.data.loans) &&
      res.data.loans.length > 0
    ) {
      return res.data.loans[0];
    }

    // Defensive: handle legacy or direct array structures: res.data
    if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
      return res.data[0];
    }
  } catch (e) {
    // Log detailed error for debugging
    if (e && typeof e === "object" && "isAxiosError" in e) {
      const err = e as AxiosError;
      console.error("Loan fetch error:", err.response?.data || err.message);
    } else {
      console.error("Failed to fetch user loan:", e);
    }
  }
  return null;
}

interface Message {
  _id?: string;
  applicationId?: string;
  text: string;
  senderType: "user" | "admin" | "ai-bot" | "system";
  senderName?: string;
  senderEmail?: string;
  createdAt: string;
  attachments?: any[];
  messageType?: "text" | "file" | "action-required";
}

export default function ChatPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const guestSession = useAppSelector((state) => state.guestChat.session);

  // State management
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [authType, setAuthType] = useState<"registered" | "guest" | null>(null);
  const [loanId, setLoanId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Helper to sync messages from the server (Polling Logic)
  const refreshMessages = async () => {
    try {
      if (authType === "registered" && user) {
        let newMsgs = [];
        if (loanId) {
          const response = await chatAPI.fetchMessages(loanId);
          newMsgs = response.data?.messages || [];
        } else {
          const response = await chatAPI.fetchMessagesByUserId(user._id);
          newMsgs = response.data?.messages || [];
        }
        setMessages((prev) =>
          prev.length !== newMsgs.length ? newMsgs : prev,
        );
      } else if (authType === "guest" && guestSession?.sessionToken) {
        const response = await guestChatAPI.fetchGuestMessages(
          guestSession.sessionToken,
        );
        const newMsgs = Array.isArray(response.data) ? response.data : [];
        setMessages((prev) =>
          prev.length !== newMsgs.length ? newMsgs : prev,
        );
      }
    } catch (error) {
      console.error("Auto-pull sync error:", error);
    }
  };

  // Determine user type on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (token && !user) {
      dispatch(getMe());
      return;
    }
    if (user) {
      localStorage.removeItem("guest_session");
      localStorage.removeItem("guest_info");
      localStorage.setItem("user_info", JSON.stringify(user));
      localStorage.setItem(
        "user_session",
        JSON.stringify({ userId: user._id, email: user.email }),
      );
      setAuthType("registered");
      return;
    }
    const savedSession = localStorage.getItem("guest_session");
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        if (session?.sessionToken) {
          dispatch(restoreGuestSession(session));
          setAuthType("guest");
          return;
        }
      } catch (error) {
        console.error("Failed to parse guest session:", error);
        localStorage.removeItem("guest_session");
      }
    }
    setShowGuestModal(true);
  }, [user, dispatch]);

  // Initialize Socket.IO
  useEffect(() => {
    if (!authType) return;

    const socketUrl =
      // process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8001";
      process.env.NEXT_PUBLIC_SOCKET_URL ||
      "https://loan-web-app-node-js-backend.onrender.com";
    const newSocket = io(socketUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    newSocket.on("connect", () => {
      setIsConnected(true);
      console.debug("[Socket] Connected", newSocket.id);
      // if (authType === "registered" && user?._id) {
      //   newSocket.emit("join_chat", { userId: user._id });
      if (authType === "registered" && user?._id) {
        newSocket.emit("join-room", {
          applicationId: loanId || user._id,
        });
      } else if (authType === "guest" && guestSession?.sessionToken) {
        newSocket.emit("join_guest_chat", {
          sessionToken: guestSession.sessionToken,
        });
      }
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
      console.debug("[Socket] Disconnected", newSocket.id);
    });

    newSocket.on("newMessage", (data) => {
      console.debug("[Socket] newMessage received", data);
      setMessages((prev) => {
        const exists = prev.find((m) => m._id === data._id);
        return exists ? prev : [...prev, data];
      });
    });

    newSocket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [authType, user, guestSession]);

  useEffect(() => {
    if (!socket || authType !== "registered" || !user?._id) return;

    socket.emit("join-room", {
      applicationId: loanId || user._id,
    });
  }, [socket, authType, user?._id, loanId]);

  // Always fetch user loan and chat history
  useEffect(() => {
    if (authType === "registered" && user && userAPI) {
      (async () => {
        setIsLoading(true);
        try {
          let loan = null;
          const storedLoanId = localStorage.getItem("user_loan_id");
          if (storedLoanId) {
            setLoanId(storedLoanId);
            loan = { _id: storedLoanId };
          } else {
            loan = await fetchUserLoan();
            if (loan?._id) {
              setLoanId(loan._id);
              localStorage.setItem("user_loan_id", loan._id);
            }
          }
          let messages = [];
          if (loan?._id) {
            const response = await chatAPI.fetchMessages(loan._id);
            messages = response.data?.messages || [];
          } else {
            const response = await chatAPI.fetchMessagesByUserId(user._id);
            messages = response.data?.messages || [];
          }
          setMessages(messages);
        } catch (error) {
          console.error("Failed to load user chat history:", error);
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, [authType, user]);

  useEffect(() => {
    if (authType !== "guest" || !guestSession?.sessionToken) return;

    (async () => {
      setIsLoading(true);
      try {
        const response = await guestChatAPI.fetchGuestMessages(
          guestSession.sessionToken,
        );

        setMessages(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Failed to load guest chat history:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [authType, guestSession?.sessionToken]);

  // Background polling every 3 seconds (does not update UI if messages are unchanged)
  useEffect(() => {
    if (!authType) return;
    let lastMsgCount = 0;
    let lastMsgIds: (string | undefined)[] = [];
    const pollInterval = setInterval(async () => {
      try {
        let newMsgs = [];
        if (authType === "registered" && user) {
          if (loanId) {
            const response = await chatAPI.fetchMessages(loanId);
            newMsgs = response.data?.messages || [];
          } else {
            const response = await chatAPI.fetchMessagesByUserId(user._id);
            newMsgs = response.data?.messages || [];
          }
        } else if (authType === "guest" && guestSession?.sessionToken) {
          const response = await guestChatAPI.fetchGuestMessages(
            guestSession.sessionToken,
          );
          newMsgs = Array.isArray(response.data) ? response.data : [];
        }
        // Only update if count or last message id changed
        if (
          newMsgs.length !== lastMsgCount ||
          (newMsgs.length > 0 &&
            lastMsgIds[lastMsgIds.length - 1] !==
              newMsgs[newMsgs.length - 1]?._id)
        ) {
          setMessages(newMsgs);
          lastMsgCount = newMsgs.length;
          lastMsgIds = newMsgs.map((m: Message) => m._id);
          console.debug("[BG Poll] Messages updated", newMsgs);
        } else {
          console.debug("[BG Poll] No change");
        }
      } catch (err) {
        console.error("[BG Poll] Error: ", err);
      }
    }, 3000);
    return () => clearInterval(pollInterval);
  }, [authType, loanId, user, guestSession?.sessionToken]);

  // Auto-scroll when messages update
  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest", // This prevents the whole page from jumping
      });
    }
  }, [messages, isTyping]);

  // Effect to handle pending calculator messages for Guests
  useEffect(() => {
    const sendPendingMessage = async () => {
      // Only proceed if we are in guest mode and have a session
      if (authType === "guest" && guestSession?.sessionToken) {
        const pendingMessage = localStorage.getItem("pending_loan_message");

        if (pendingMessage) {
          try {
            // Send the message using your existing guest API logic
            const messageData = {
              sessionToken: guestSession.sessionToken,
              text: pendingMessage,
            };

            await guestChatAPI.sendGuestMessage(messageData);

            // Clear the message so it doesn't send again on refresh
            localStorage.removeItem("pending_loan_message");
            // localStorage.removeItem("pending_loan_data");

            // Refresh the UI to show the new message
            await refreshMessages();

            toast.success("Loan details shared with support");
          } catch (error) {
            console.error("Failed to send pending guest message:", error);
          }
        }
      }
    };

    sendPendingMessage();
  }, [authType, guestSession?.sessionToken]);

  // Handle send message
  // const handleSendMessage = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!newMessage.trim() || !authType) return;

  //   try {
  //     setIsSending(true);
  //     if (authType === "registered" && user) {
  //       let messageData: any = {
  //         text: newMessage,
  //         senderType: "user" as const,
  //         email: user.email,
  //       };
  //       if (loanId) {
  //         messageData.applicationId = loanId;
  //       } else {
  //         messageData.userId = user._id;
  //       }
  //       await chatAPI.sendMessage(messageData);
  //     }
  //     else if (authType === "guest" && guestSession) {
  //       const messageData = {
  //         sessionToken: guestSession.sessionToken,
  //         text: newMessage,
  //       };
  //       await guestChatAPI.sendGuestMessage(messageData);
  //     }

  //     setNewMessage("");
  //     // Immediate sync after sending
  //     await refreshMessages();
  //   } catch (error: any) {
  //     toast.error("Failed to send message");
  //     console.error("Send message error:", error);
  //   } finally {
  //     setIsSending(false);
  //   }
  // };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !authType) return;

    try {
      setIsSending(true);

      if (authType === "registered" && user) {
        let messageData: any = {
          text: newMessage,
          senderType: "user" as const,
          email: user.email,
        };

        if (loanId) {
          messageData.applicationId = loanId;
        } else {
          messageData.userId = user._id;
        }

        await chatAPI.sendMessage(messageData);
      } else if (authType === "guest" && guestSession) {
        const messageData = {
          sessionToken: guestSession.sessionToken,
          text: newMessage,
        };

        const response = await guestChatAPI.sendGuestMessage(messageData);

        const incomingMessages = [
          response.data?.userMessage,
          response.data?.botMessage,
        ].filter(Boolean);

        if (incomingMessages.length > 0) {
          setMessages((prev) => {
            const existingIds = new Set(prev.map((msg) => msg._id));
            const uniqueIncoming = incomingMessages.filter(
              (msg) => !existingIds.has(msg._id),
            );

            return [...prev, ...uniqueIncoming];
          });
        }
      }

      setNewMessage("");
      await refreshMessages();
    } catch (error: any) {
      toast.error("Failed to send message");
      console.error("Send message error:", error);
    } finally {
      setIsSending(false);
    }
  };

  // Handle logout (for registered users)
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
    toast.success("Logged out successfully");
  };

  // Handle guest modal close
  // const handleGuestModalSuccess = (session: any) => {
  //   setAuthType("guest");
  //   setShowGuestModal(false);
  // };
  const handleGuestModalSuccess = (session: any) => {
    setMessages(Array.isArray(session?.messages) ? session.messages : []);
    setAuthType("guest");
    setShowGuestModal(false);
  };

  // Handle guest logout
  const handleGuestLogout = () => {
    localStorage.removeItem("guest_session");
    setAuthType(null);
    setMessages([]);
    setShowGuestModal(true);
    toast.success("Guest session ended");
  };

  if (!authType && !showGuestModal) {
    return null;
  }

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />

      <GuestChatModal
        isOpen={showGuestModal}
        onClose={() => {
          if (!authType) setShowGuestModal(false);
        }}
        onSuccess={handleGuestModalSuccess}
      />

      {/* <div className="flex-grow flex mt-[80px]"> */}
      <div className="flex-grow flex mt-[80px] h-[calc(100vh-80px)] overflow-hidden">
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMobileMenu(false)}
            className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
          />
        )}

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`bg-[#001D42] border-r border-white/10 flex flex-col md:w-80 md:static md:flex transition-all duration-300 ${
            showMobileMenu
              ? "fixed inset-0 top-0 bottom-0 w-full z-50 overflow-y-auto"
              : "hidden"
          }`}
        >
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-bold text-blue-300 uppercase tracking-[2px]">
                {authType === "registered" ? "Security Verified" : "Guest Mode"}
              </h3>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="md:hidden p-2 hover:bg-white/10 rounded-full text-white/70 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center font-bold text-white shrink-0 shadow-lg">
                {(authType === "registered"
                  ? user?.fullName?.[0]
                  : guestSession?.guest.fullName?.[0]) || "U"}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">
                  {authType === "registered"
                    ? user?.fullName || user?.email
                    : guestSession?.guest.fullName}
                </p>
                <p className="text-[11px] text-blue-200/60 truncate">
                  {authType === "registered"
                    ? user?.email
                    : guestSession?.guest.email}
                </p>
              </div>
            </div>
          </div>

          <div className="flex-grow p-4 space-y-4 overflow-y-auto custom-scrollbar">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="text-blue-400" size={16} />
                <h4 className="font-bold text-xs text-blue-100">
                  Chat Insights
                </h4>
              </div>
              <ul className="space-y-3">
                <li className="flex gap-3 text-[12px] text-blue-100/70">
                  <CheckCircle2 className="text-blue-400 shrink-0" size={14} />
                  <span>
                    {authType === "registered"
                      ? "Encrypted Member Chat"
                      : "Temporary Guest Session"}
                  </span>
                </li>
                <li className="flex gap-3 text-[12px] text-blue-100/70">
                  <CheckCircle2 className="text-blue-400 shrink-0" size={14} />
                  <span>Real-time agent support active</span>
                </li>
                {authType === "guest" && (
                  <>
                    <li className="flex gap-3 text-[12px] text-blue-100/70">
                      <CheckCircle2
                        className="text-blue-400 shrink-0"
                        size={14}
                      />
                      <span>Expires in 24 hours</span>
                    </li>
                    <li className="flex gap-3 text-[12px] text-amber-400 font-medium">
                      <Lock className="shrink-0" size={14} />
                      <span>Save history by registering</span>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {authType === "guest" && (
              <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-4 shadow-xl">
                <div className="relative z-10">
                  <h4 className="font-bold text-sm text-white mb-1">
                    Claim your history
                  </h4>
                  <p className="text-[11px] text-blue-100 mb-4 leading-relaxed">
                    Don't lose this conversation. Sign up now to sync your
                    messages.
                  </p>
                  {/* <a */}
                  <Link
                    href="/signup"
                    className="flex items-center justify-center gap-2 w-full py-2 bg-white text-[#002D62] rounded-xl text-xs font-bold hover:bg-blue-50 transition-all shadow-lg"
                  >
                    Register Now
                    <ArrowRight size={14} />
                  </Link>
                  {/* </a> */}
                </div>
                <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/5 bg-black/10">
            <button
              onClick={
                authType === "registered" ? handleLogout : handleGuestLogout
              }
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white/5 hover:bg-red-500/10 text-white/70 hover:text-red-400 rounded-xl transition-all border border-white/10 hover:border-red-500/20 text-xs font-bold"
            >
              <LogOut size={16} />
              {authType === "registered"
                ? "Logout Account"
                : "Terminate Session"}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2">
              <span
                className={`w-2 h-2 rounded-full animate-pulse ${isConnected ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" : "bg-red-400"}`}
              ></span>
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                {isConnected ? "Secure Connection" : "Offline"}
              </span>
            </div>
          </div>
        </motion.div>

        <div className="flex-grow flex flex-col">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-full"
          >
            <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between relative z-30">
              <div className="flex items-center flex-grow">
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="md:hidden mr-4 p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  aria-label="Toggle menu"
                >
                  <Menu size={22} className="text-gray-700" />
                </button>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {authType === "registered"
                      ? "Chat with Support"
                      : "Guest Chat Support"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {authType === "registered"
                      ? "Registered User"
                      : "Guest Session"}
                  </p>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg flex-shrink-0">
                <Settings size={20} />
              </button>
            </div>

            {/* <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50"> */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 custom-scrollbar">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="animate-spin text-blue-600" size={40} />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <p className="text-lg font-semibold mb-2">👋 Welcome!</p>
                    <p className="text-sm">
                      Start the conversation by sending a message
                    </p>
                  </div>
                </div>
              ) : (
                <AnimatePresence>
                  {messages.map((msg, index) => (
                    <motion.div
                      key={msg._id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.senderType === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg shadow-sm ${
                          msg.senderType === "user"
                            ? "bg-blue-600 text-white rounded-br-none"
                            : "bg-white text-gray-900 rounded-bl-none border border-gray-200"
                        }`}
                      >
                        {msg.senderName && msg.senderType !== "user" && (
                          <p className="text-xs font-semibold opacity-75 mb-1">
                            {msg.senderName}
                          </p>
                        )}
                        {["ai-bot", "system"].includes(msg.senderType) ? (
                          // <div className="text-[13px] leading-relaxed font-medium break-words prose prose-sm prose-invert max-w-none">
                          <div className="text-[13px] leading-relaxed font-medium break-words prose prose-sm max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {msg.text || ""}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.text || ""}
                          </ReactMarkdown>
                        )}
                        <p
                          className={`text-xs mt-2 ${msg.senderType === "user" ? "text-blue-100" : "text-gray-500"}`}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
              <div ref={messagesEndRef} />
            </div>

            {!isConnected && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-yellow-50 border-l-4 border-yellow-400 p-4 m-4"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle size={20} className="text-yellow-600" />
                  <p className="text-sm text-yellow-700">
                    Connection unstable. Syncing messages...
                  </p>
                </div>
              </motion.div>
            )}

            <form
              onSubmit={handleSendMessage}
              className="bg-white border-t border-gray-200 p-4"
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isSending}
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:opacity-50 text-black"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || isSending}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  {isSending ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <Send size={20} />
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
