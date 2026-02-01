"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  ArrowLeft,
  DollarSign,
  Clock,
  Percent,
  Paperclip,
  Smile,
  FileText,
  X,
  User,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { Navigation } from "@/app/components";
import { RootState } from "@/lib/redux/store";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { initChat, fetchMessages } from "@/lib/redux/features/chatSlice";
import { useParams } from "next/navigation";
import EmojiPicker from "emoji-picker-react";
import axios from "axios";
import { getSocket } from "@/lib/socket";

interface Application {
  _id: string;
  userName: string;
  userEmail: string;
  amount: number;
  term: number;
  interest?: number;
  status: string;
  clientLastTyped?: string;
}

type MessageStatus = "sending" | "sent" | "failed";

interface PendingMessage {
  tempId: string;
  applicationId: string;
  text: string;
  senderType: "admin";
  email: string;
  attachments: File[];
  createdAt: string;
  status: MessageStatus;
  progress?: number;
}

export default function AdminChatDetail() {
  const [inputText, setInputText] = useState("");
  const [adminEmail] = useState("admin@company.com");
  const [showEmoji, setShowEmoji] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showOptions, setShowOptions] = useState(false);

  const [isClientTyping, setIsClientTyping] = useState(false);
  const [pendingMessages, setPendingMessages] = useState<PendingMessage[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiContainerRef = useRef<HTMLDivElement>(null); // Ref for outside click detection
  const params = useParams();
  const dispatch = useAppDispatch();

  const { application, messages } = useAppSelector(
    (state: RootState) => state.chat,
  ) as { application: Application | null; messages: any[] };

  // --- NEW: Click Outside Emoji Picker Logic ---
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        emojiContainerRef.current &&
        !emojiContainerRef.current.contains(event.target as Node)
      ) {
        setShowEmoji(false);
      }
    }

    if (showEmoji) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmoji]);
  // ---------------------------------------------

  const downloadFile = async (url: string, filename: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  useEffect(() => {
    const socket = getSocket();
    const appId = params.id as string;

    if (appId) {
      dispatch(
        initChat({
          name: "Administrator",
          email: adminEmail,
          role: "admin",
          loanData: { applicationId: appId },
        }),
      );

      socket.emit("join-room", { applicationId: appId });
      socket.emit("mark-read", { applicationId: appId, userType: "admin" });

      socket.on("newMessage", (_message: any) => {
        dispatch(fetchMessages(appId));
      });

      socket.on("typing", ({ senderType }: { senderType: string }) => {
        if (senderType === "user") setIsClientTyping(true);
      });

      socket.on("stop-typing", () => {
        setIsClientTyping(false);
      });
    }

    return () => {
      socket.off("newMessage");
      socket.off("typing");
      socket.off("stop-typing");
    };
  }, [params.id, dispatch, adminEmail]);

  useEffect(() => {
    const appId = params.id as string;
    if (!appId) return;
    const interval = setInterval(() => {
      dispatch(fetchMessages(appId));
      if (application?.clientLastTyped) {
        const lastActive = new Date(application.clientLastTyped).getTime();
        const now = Date.now();
        setIsClientTyping(now - lastActive < 4000);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [params.id, application, dispatch]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleSendMessage = async (
    e: React.FormEvent,
    retryMsg?: PendingMessage,
  ) => {
    if (e) e.preventDefault();
    const appId = (params.id as string) || application?._id;
    if ((!inputText.trim() && attachments.length === 0 && !retryMsg) || !appId)
      return;

    const tempId = retryMsg?.tempId || `temp_${Date.now()}`;
    const messageText = retryMsg ? retryMsg.text : inputText;
    const messageFiles = retryMsg ? retryMsg.attachments : attachments;

    const pendingMsg: PendingMessage = {
      tempId,
      applicationId: appId,
      text: messageText,
      senderType: "admin",
      email: adminEmail,
      attachments: messageFiles,
      createdAt: new Date().toISOString(),
      status: "sending",
      progress: 0,
    };

    if (!retryMsg) {
      setPendingMessages((prev) => [pendingMsg, ...prev]);
      setInputText("");
      setAttachments([]);
      setShowEmoji(false);
    } else {
      setPendingMessages((prev) =>
        prev.map((m) =>
          m.tempId === tempId ? { ...m, status: "sending", progress: 0 } : m,
        ),
      );
    }

    try {
      const formData = new FormData();
      formData.append("applicationId", appId);
      formData.append("text", messageText);
      formData.append("senderType", "admin");
      formData.append("email", adminEmail);
      messageFiles.forEach((file) => formData.append("files", file));

      await axios.post(
        `${process.env.BACKEND_URL}/api/chat/message`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1),
            );
            setPendingMessages((prev) =>
              prev.map((m) => (m.tempId === tempId ? { ...m, progress } : m)),
            );
          },
        },
      );
      setPendingMessages((prev) => prev.filter((m) => m.tempId !== tempId));
      dispatch(fetchMessages(appId));
    } catch (err) {
      setPendingMessages((prev) =>
        prev.map((m) => (m.tempId === tempId ? { ...m, status: "failed" } : m)),
      );
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, pendingMessages, isClientTyping]);

  return (
    <main className="bg-[#F8FAFC] min-h-screen relative">
      <div className="pt-2 h-screen flex overflow-hidden">
        <div className="flex-1 flex flex-col border-r border-slate-200 bg-white relative w-full min-w-0">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white z-10">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"
              >
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h2 className="font-bold text-[#002D62]">
                  {application?.userName || "Client Session"}
                </h2>
                <p className="text-[10px] text-green-500 font-bold uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  Live
                </p>
              </div>
            </div>
          </div>
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50/30"
          >
            {[...messages, ...pendingMessages]
              .sort(
                (a: any, b: any) =>
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime(),
              )
              .map((msg: any) => (
                <div
                  key={msg._id || msg.tempId}
                  className={`flex ${msg.senderType === "admin" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] md:max-w-[70%] p-4 shadow-sm rounded-2xl ${msg.senderType === "admin" ? "bg-[#002D62] text-white rounded-tr-none" : "bg-white border text-slate-700 rounded-tl-none"}`}
                  >
                    {msg.text && (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.text}
                      </p>
                    )}
                    {(msg.attachments || []).map((att: any, i: number) => (
                      <div
                        key={i}
                        className="mt-2 rounded-lg overflow-hidden border border-white/10"
                      >
                        {att.contentType?.startsWith("image/") ||
                        (att instanceof File &&
                          att.type.startsWith("image/")) ? (
                          <img
                            src={
                              att instanceof File
                                ? URL.createObjectURL(att)
                                : att.url
                            }
                            alt="attachment"
                            className="max-w-full h-auto"
                          />
                        ) : (
                          <div className="flex items-center justify-between p-3 bg-black/10 rounded">
                            <div className="flex items-center gap-2 truncate">
                              <FileText size={16} />
                              <span className="text-xs truncate">
                                {att.filename || att.name}
                              </span>
                            </div>
                            {att.url && (
                              <button
                                onClick={() =>
                                  downloadFile(att.url, att.filename)
                                }
                                className="text-[10px] font-bold underline ml-2"
                              >
                                Save
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                    {msg.status === "sending" && (
                      <p className="text-[9px] mt-1 animate-pulse">
                        Sending... {msg.progress}%
                      </p>
                    )}
                    {msg.status === "failed" && (
                      <button
                        onClick={(e) => handleSendMessage(e as any, msg)}
                        className="text-[9px] mt-1 text-red-300 underline"
                      >
                        Retry
                      </button>
                    )}
                    <p className="text-[10px] mt-2 opacity-60 text-right">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            {isClientTyping && (
              <div className="text-[10px] text-blue-500 font-bold animate-pulse">
                Client is typing...
              </div>
            )}
          </div>
          <div className="p-4 border-t bg-white" ref={emojiContainerRef}>
            {attachments.length > 0 && (
              <div className="flex gap-2 mb-3 overflow-x-auto">
                {attachments.map((file, i) => (
                  <div
                    key={i}
                    className="relative bg-slate-100 p-2 rounded-lg border"
                  >
                    <FileText size={20} className="text-blue-600" />
                    <button
                      onClick={() =>
                        setAttachments(
                          attachments.filter((_, idx) => idx !== i),
                        )
                      }
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <form
              onSubmit={handleSendMessage}
              className="flex items-center gap-2 bg-slate-100 p-2 rounded-2xl"
            >
              <button
                type="button"
                onClick={() => setShowOptions(!showOptions)}
                className="p-2 text-slate-400"
              >
                <Plus size={20} className={showOptions ? "rotate-45" : ""} />
              </button>
              <AnimatePresence>
                {showOptions && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "auto" }}
                    className="flex overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setShowEmoji(!showEmoji)}
                      className="p-2 text-slate-400"
                    >
                      <Smile size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 text-slate-400"
                    >
                      <Paperclip size={20} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              <input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-black"
              />
              <input
                type="file"
                hidden
                ref={fileInputRef}
                multiple
                onChange={handleFileSelect}
              />
              <button
                type="submit"
                className="bg-[#002D62] text-white p-3 rounded-xl"
              >
                <Send size={20} />
              </button>
            </form>
            {showEmoji && (
              <div className="absolute bottom-24 left-6 z-50">
                <EmojiPicker
                  onEmojiClick={(e) => setInputText((prev) => prev + e.emoji)}
                />
              </div>
            )}
          </div>
        </div>
        <aside className="w-[350px] bg-white hidden lg:flex flex-col border-l p-8 overflow-y-auto">
          <div className="bg-slate-50 rounded-3xl p-6 border text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-full mx-auto shadow-sm flex items-center justify-center text-[#002D62] font-black text-2xl mb-4 border">
              {application?.userName?.charAt(0) || <User size={24} />}
            </div>
            <p className="font-black text-[#002D62] text-lg">
              {application?.userName || "Loading..."}
            </p>
            <p className="text-xs text-slate-400 mb-4">
              {application?.userEmail}
            </p>
            <div className="bg-white px-3 py-1 inline-block rounded-xl border text-[10px] font-bold text-amber-600 uppercase">
              {application?.status || "pending"}
            </div>
          </div>
          <div className="space-y-3">
            <DetailRow
              icon={<DollarSign size={16} />}
              label="Principal"
              value={`$${application?.amount?.toLocaleString() || 0}`}
              color="blue"
            />
            <DetailRow
              icon={<Percent size={16} />}
              label="Interest"
              value={`${application?.interest || 0}%`}
              color="amber"
            />
            <DetailRow
              icon={<Clock size={16} />}
              label="Term"
              value={`${application?.term || 0} Mo.`}
              color="blue"
            />
          </div>
        </aside>
      </div>
    </main>
  );
}

function DetailRow({
  icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: string;
  color: "blue" | "amber";
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-lg ${color === "blue" ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"}`}
        >
          {icon}
        </div>
        <span className="text-xs font-bold text-slate-500">{label}</span>
      </div>
      <span className="text-xs font-black text-[#002D62]">{value}</span>
    </div>
  );
}
