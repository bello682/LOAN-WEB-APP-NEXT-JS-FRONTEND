"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Settings,
  Loader2,
  AlertCircle,
  Send,
  Smile,
  Paperclip,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown"; // Standard markdown library
import dynamic from "next/dynamic";
import io, { Socket } from "socket.io-client";
import { Navigation, Footer } from "@/app/components";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import toast from "react-hot-toast";
import { chatAPI, userAPI } from "@/lib/api";
import { getMe } from "@/lib/redux/features/authSlice";

// --- Internal Markdown Component (Fixes your Prop error) ---
const MarkdownRenderer = ({
  content,
  isUser,
}: {
  content: string;
  isUser: boolean;
}) => {
  return (
    <div
      className={`prose prose-sm max-w-none ${isUser ? "prose-invert text-white" : "text-gray-800"}`}
    >
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

async function fetchUserLoan() {
  try {
    const res = await userAPI.getMyLoans();
    if (
      res?.data?.loans &&
      Array.isArray(res.data.loans) &&
      res.data.loans.length > 0
    ) {
      return res.data.loans[0];
    }
  } catch (e) {
    console.error("Failed to fetch user loan:", e);
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
}

export const ChatContent = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loanId, setLoanId] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // const refreshMessages = async () => {
  //   if (!user?._id) return;
  //   try {
  //     let response;
  //     if (loanId) {
  //       response = await chatAPI.fetchMessages(loanId);
  //     } else {
  //       response = await chatAPI.fetchMessagesByUserId(user._id);
  //     }
  //     const newMsgs = response.data?.messages || [];
  //     // setMessages((prev) => (prev.length !== newMsgs.length ? newMsgs : prev));
  //     setMessages(newMsgs);
  //   } catch (error) {
  //     console.error("Sync error:", error);
  //   }
  // };
  const refreshMessages = async () => {
    if (!user?._id) return;
    try {
      const response = loanId
        ? await chatAPI.fetchMessages(loanId)
        : await chatAPI.fetchMessagesByUserId(user._id);

      const newMsgs = response.data?.messages || [];

      // Use a Map to ensure unique IDs based on _id
      setMessages(newMsgs);
    } catch (error) {
      console.error("Sync error:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // If user exists but _id is missing, or user doesn't exist at all
    if (!user || !user._id) {
      dispatch(getMe());
    }
  }, [user, dispatch, router]); // Keep watching 'user' here

  useEffect(() => {
    if (!user) return;

    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8001";
    const newSocket = io(socketUrl, { reconnection: true });

    newSocket.on("connect", () => {
      setIsConnected(true);
      newSocket.emit("join_chat", { userId: user._id });
    });

    newSocket.on("disconnect", () => setIsConnected(false));

    // newSocket.on("newMessage", (data) => {
    //   setMessages((prev) => {
    //     const exists = prev.find((m) => m._id === data._id);
    //     return exists ? prev : [...prev, data];
    //   });
    // });
    newSocket.on("newMessage", (data) => {
      setMessages((prev) => {
        // Only add if this specific ID doesn't exist yet
        if (prev.find((m) => m._id === data._id)) return prev;
        return [...prev, data];
      });
    });

    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    // Add a log right at the top to see if the effect even WAKES UP
    if (user && user._id) {
      // Use a strict check
      (async () => {
        setIsLoading(true);
        try {
          let loanIdToUse = localStorage.getItem("user_loan_id");
          if (!loanIdToUse) {
            const loan = await fetchUserLoan();
            if (loan?._id) {
              loanIdToUse = loan._id;
              localStorage.setItem("user_loan_id", loan._id);
            }
          }
          setLoanId(loanIdToUse);
          const response = loanIdToUse
            ? await chatAPI.fetchMessages(loanIdToUse)
            : await chatAPI.fetchMessagesByUserId(user._id);
          setMessages(response.data?.messages || []);
        } catch (error) {
          console.error("History load error:", error);
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, [user, user?._id, loanId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  /* =========================================================================
 =========================================================================*/
  // --- AUTOMATIC LOAN MESSAGE HANDLER ---
  // useEffect(() => {
  //   const sendPendingMessage = async () => {
  //     // 1. Check if there is a message and if user/socket are ready
  //     const pendingMessage = localStorage.getItem("pending_loan_message");

  //     if (pendingMessage && user && isConnected && user?._id) {
  //       try {
  //         setIsSending(true);

  //         const messageData: any = {
  //           text: pendingMessage,
  //           senderType: "user",
  //           email: user.email,
  //           userId: user._id,
  //         };

  //         // LOGIC: Ensure we have at least one valid ID to satisfy the backend
  //         // Use loanId if available, otherwise fallback to userId
  //         if (loanId) {
  //           messageData.applicationId = loanId;
  //         } else if (user._id) {
  //           messageData.userId = user._id;
  //         } else {
  //           return; // Exit if for some reason IDs are still missing
  //         }

  //         // 2. Send the message to the API
  //         await chatAPI.sendMessage(messageData);

  //         // 3. Clear from localStorage so it doesn't send again on refresh
  //         localStorage.removeItem("pending_loan_message");
  //         // localStorage.removeItem("pending_loan_data");
  //         // localStorage.removeItem("loan_calculation");

  //         // // 4. Refresh the UI
  //         // await refreshMessages();

  //         // Give the backend 500ms to index the message before refreshing
  //         setTimeout(async () => {
  //           await refreshMessages();
  //         }, 500);

  //         toast.success("Loan details shared with admin");
  //       } catch (error) {
  //         console.error("Failed to auto-send loan message:", error);
  //       } finally {
  //         setIsSending(false);
  //       }
  //     }
  //   };

  //   // Only run when connection is established
  //   if (isConnected && user?._id) {
  //     sendPendingMessage();
  //   }
  // }, [isConnected, user?._id, loanId]);

  // --- AUTOMATIC LOAN MESSAGE HANDLER ---
  useEffect(() => {
    const sendPendingMessage = async () => {
      const pendingMessage = localStorage.getItem("pending_loan_message");

      // Ensure we have the user and the ID before proceeding
      if (pendingMessage && user?._id && isConnected) {
        localStorage.removeItem("pending_loan_message");

        try {
          setIsSending(true);

          // Construct the object properly BEFORE sending
          const messageData: any = {
            text: pendingMessage,
            senderType: "user",
            email: user.email,
            userId: user._id, // Set this explicitly here
          };

          // Add loanId if it exists
          if (loanId) {
            messageData.applicationId = loanId;
          }

          // NOW send the data
          await chatAPI.sendMessage(messageData);

          setTimeout(async () => {
            await refreshMessages();
          }, 500);

          toast.success("Loan details shared with admin");
        } catch (error) {
          console.error("Failed to auto-send loan message:", error);
          toast.error("Could not sync loan details");
        } finally {
          setIsSending(false);
        }
      }
    };

    if (isConnected && user?._id) {
      sendPendingMessage();
    }
  }, [isConnected, user?._id, loanId, user]);
  /* =========================================================================
 =========================================================================*/

  // const handleSendMessage = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!newMessage.trim() || !user) return;

  //   try {
  //     setIsSending(true);
  //     const messageData: any = {
  //       text: newMessage,
  //       senderType: "user",
  //       email: user.email,
  //     };
  //     if (loanId) messageData.applicationId = loanId;
  //     else messageData.userId = user._id;

  //     // await chatAPI.sendMessage(messageData);

  //     const response = await chatAPI.sendMessage(messageData);

  //     // Use the data immediately from the network response you saw!
  //     if (response.data?.success) {
  //       const { message, aiMessage } = response.data;
  //       setMessages((prev) => [...prev, message, aiMessage].filter(Boolean));
  //     }
  //     setNewMessage("");
  //     // Refresh background sync
  //     await refreshMessages();
  //   } catch (error) {
  //     toast.error("Failed to send message");
  //   } finally {
  //     setIsSending(false);
  //   }
  // };
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    try {
      setIsSending(true);
      const messageData: any = {
        text: newMessage,
        senderType: "user",
        email: user.email,
        userId: user._id,
      };

      if (loanId) messageData.applicationId = loanId;
      else messageData.userId = user._id;

      const response = await chatAPI.sendMessage(messageData);

      if (response.data?.success) {
        const { message, aiMessage } = response.data;

        // 1. Clear input and add User Message immediately
        setNewMessage("");
        setMessages((prev) => {
          // Only add if the message isn't already there (prevents Socket collision)
          if (prev.some((m) => m._id === message._id)) return prev;
          return [...prev, message];
        });

        // 2. Start Typing effect for AI
        if (aiMessage) {
          setIsTyping(true);
          setTimeout(() => {
            setMessages((prev) => {
              // Again, check for duplicates before adding
              if (prev.some((m) => m._id === aiMessage._id)) return prev;
              return [...prev, aiMessage];
            });
            setIsTyping(false);
          }, 1500);
        }
      }
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden h-[calc(100vh-120px)]">
      {/* Header - Stays at top of the chat box */}
      {/* <div className="bg-white border-b border-gray-100 p-4 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-md font-bold text-gray-900">Support Assistant</h2>
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-400" : "bg-red-400"}`}
            />
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">
              {isConnected ? "Secure & Active" : "Connecting..."}
            </p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 transition-colors">
          {user?.email || user?.fullName}{" "}
          <Settings size={16} className="inline-block ml-1" />
        </button>
      </div> */}
      {/* Header - Stays at top of the chat box */}
      <div className="bg-white border-b border-gray-100 p-4 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-md font-bold text-gray-900">Support Assistant</h2>
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-400" : "bg-red-400 animate-pulse"}`}
            />
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">
              {isConnected ? "Secure & Active" : "Connecting..."}
            </p>
          </div>
        </div>

        {/* Updated Profile Status Button */}
        <button className="flex items-center gap-3 px-3 py-1.5 hover:bg-gray-50 rounded-2xl border border-gray-100 transition-all shadow-sm">
          <div className="text-right hidden sm:block">
            <p className="text-[11px] font-bold text-gray-900 leading-none">
              {user?.fullName || "User Account"}
            </p>
            <p className="text-[9px] text-gray-500 mt-0.5">{user?.email}</p>
          </div>

          {/* Dynamic Status Indicator */}
          <div className="relative">
            <div className="w-8 h-8 bg-[#002D62] rounded-full flex items-center justify-center text-white text-xs font-bold">
              {user?.fullName?.charAt(0).toUpperCase() || "U"}
            </div>
            {/* The Green/Red Circle */}
            <div
              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-white rounded-full ${
                isConnected ? "bg-emerald-500" : "bg-red-500"
              }`}
            />
          </div>
        </button>
      </div>

      {/* Messages Area - Only this part scrolls */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-[#F8FAFC]/50 custom-scrollbar">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="animate-spin text-blue-600" size={32} />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div className="max-w-xs">
              <p className="text-lg font-bold text-gray-900 mb-1">
                Hello {user.fullName?.split(" ")[0]}! 👋
              </p>
              <p className="text-sm text-gray-500">
                Need help with your loan? Send us a message below.
              </p>
            </div>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                // key={msg._id || index}
                key={`${msg._id}-${index}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`flex ${msg.senderType === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] md:max-w-[70%] px-4 py-3 rounded-2xl ${
                    msg.senderType === "user"
                      ? "bg-[#002D62] text-white rounded-tr-none shadow-md shadow-blue-900/10"
                      : "bg-white text-gray-900 rounded-tl-none border border-gray-100 shadow-sm"
                  }`}
                >
                  {["ai-bot", "system"].includes(msg.senderType) ? (
                    <MarkdownRenderer
                      content={msg.text}
                      isUser={msg.senderType === "user"}
                    />
                  ) : (
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  )}
                  <p
                    className={`text-[9px] mt-1.5 font-medium opacity-50 ${msg.senderType === "user" ? "text-right" : "text-left"}`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Stays at bottom of the chat box */}
      <div className="p-4 bg-white border-t border-gray-100 shrink-0">
        {!isConnected && (
          <div className="mb-3 flex items-center gap-2 text-[11px] text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-100">
            <AlertCircle size={14} />
            <span>Connection unstable... hanging tight.</span>
          </div>
        )}

        <form
          onSubmit={handleSendMessage}
          className="relative flex items-center gap-2"
        >
          {/* Popover Options Menu */}
          <AnimatePresence>
            {showOptions && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                className="absolute bottom-16 left-0 bg-white border border-gray-100 shadow-xl rounded-2xl p-2 flex flex-col gap-1 z-50 min-w-[150px]"
              >
                <button
                  type="button"
                  className="p-3 hover:bg-blue-50 text-blue-600 rounded-xl transition-colors flex items-center gap-3 text-sm font-medium"
                  onClick={() => setShowOptions(false)}
                >
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Paperclip size={18} />
                  </div>
                  <span>File</span>
                </button>

                <button
                  type="button"
                  className="p-3 hover:bg-amber-50 text-amber-600 rounded-xl transition-colors flex items-center gap-3 text-sm font-medium"
                  onClick={() => setShowOptions(false)}
                >
                  <div className="bg-amber-100 p-2 rounded-lg">
                    <Smile size={18} />
                  </div>
                  <span>Emoji</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative flex-grow flex items-center">
            {/* Toggle Button Inside Input */}
            <button
              type="button"
              onClick={() => setShowOptions(!showOptions)}
              className={`absolute left-2 p-2 rounded-xl transition-all z-10 ${
                showOptions
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-gray-100"
              }`}
            >
              <Plus
                size={20}
                className={`transition-transform duration-200 ${showOptions ? "rotate-45" : "rotate-0"}`}
              />
            </button>

            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message here..."
              disabled={isSending}
              className="w-full pl-12 pr-14 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-black"
            />

            <button
              type="submit"
              disabled={!newMessage.trim() || isSending}
              className="absolute right-1.5 p-2.5 bg-[#002D62] text-white rounded-xl hover:bg-blue-800 disabled:opacity-50 transition-all shadow-lg shadow-blue-900/20"
            >
              {isSending ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
