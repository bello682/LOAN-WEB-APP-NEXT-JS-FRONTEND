"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toggleLoanAI } from "../../../../lib/redux/features/adminSlice";
import {
  Send,
  ArrowLeft,
  DollarSign,
  Clock,
  Percent,
  X,
  Plus,
  Info,
  Search,
  Bot,
  MessageCircle,
  Loader2,
  Mail,
  TypeIcon,
  PanelsTopLeft,
  IdCard,
  Briefcase,
  Calendar,
} from "lucide-react";
import { RootState } from "@/lib/redux/store";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  initChat,
  fetchMessages,
  fetchMessagesByUserId,
} from "@/lib/redux/features/chatSlice";
import { getSocket } from "@/lib/socket";
import AdminLayout from "../../layout/AdminLayout";
import { adminAPI, chatAPI } from "@/lib/api";
import { toast } from "react-hot-toast";

export default function AdminChatDetail() {
  const [inputText, setInputText] = useState("");
  const [showInfoSidebar, setShowInfoSidebar] = useState(false);
  const [chatList, setChatList] = useState<any[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [togglingAi, setTogglingAi] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  const { admin } = useAppSelector((state: RootState) => state.admin);
  const { messages } = useAppSelector((state: RootState) => state.chat);

  const activeApp = useMemo(() => {
    return chatList.find((c) => c._id === selectedId);
  }, [selectedId, chatList]);

  const isAiActive = activeApp?.aiAssistant?.isActive ?? false;

  console.log(" AI TOGGLE FROM THE BACKEND IS:", isAiActive);

  const filteredUserList = useMemo(() => {
    const seenEmails = new Set();
    const sortedList = [...chatList].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );

    return sortedList.filter((chat) => {
      const matchesSearch = chat.userName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
      const email = chat.userEmail || chat.email || chat.userId?.email;
      if (!email) return true;
      if (seenEmails.has(email)) return false;
      seenEmails.add(email);
      return true;
    });
  }, [chatList, searchQuery]);

  const fetchAllChats = async () => {
    try {
      const res = await chatAPI.getApplications();
      const rawData =
        res.data?.loans || res.data?.applications || res.data || [];
      setChatList(Array.isArray(rawData) ? rawData : []);
    } catch (err) {
      console.error("Failed to fetch chat list", err);
    } finally {
      setLoadingList(false);
    }
  };
  useEffect(() => {
    const socket = getSocket();
    const handleMessage = (payload: any) => {
      if (
        payload.applicationId === selectedId ||
        payload.chatId === selectedId
      ) {
        dispatch(fetchMessagesByUserId(selectedId!));
      }
      fetchAllChats();
    };
    socket.on("newMessage", handleMessage);
    return () => {
      socket.off("newMessage", handleMessage);
    };
  }, [selectedId, dispatch]);

  useEffect(() => {
    fetchAllChats();
  }, []);

  useEffect(() => {
    if (!selectedId || !admin) return;

    const socket = getSocket();

    // 1. FIND THE ACTUAL USER ID
    // If activeApp.userId is an object, take ._id. If it's a string, take it.
    // If it doesn't exist (Guest), use the selectedId as fallback.
    const targetUserId =
      activeApp?.userId?._id || activeApp?.userId || activeApp?._id;

    if (targetUserId) {
      // 2. DISPATCH USING THE RESOLVED USER ID
      dispatch(fetchMessagesByUserId(targetUserId));
    }

    dispatch(
      initChat({
        name: admin.name || "Administrator",
        email: admin.email,
        role: "admin",
        loanData: { applicationId: selectedId },
      }),
    );

    socket.emit("join-room", { applicationId: selectedId });
  }, [selectedId, admin, dispatch, activeApp]); // Add activeApp to dependencies

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleToggleAI = async () => {
    if (!selectedId || togglingAi) return;

    const isGuest = !activeApp?.userId;
    const nextState = !isAiActive;

    // 1. Optimistic UI update (Local)
    setChatList((prev) =>
      prev.map((chat) =>
        chat._id === selectedId
          ? {
              ...chat,
              aiAssistant: { ...chat.aiAssistant, isActive: nextState },
            }
          : chat,
      ),
    );

    setTogglingAi(true);

    try {
      // 2. Use the Redux Thunk you already built!
      // Make sure you pass the object structure the thunk expects
      await dispatch(
        toggleLoanAI({
          loanId: selectedId,
          isActive: nextState,
          isGuest,
        }),
      ).unwrap();

      toast.success(nextState ? "AI Copilot Active" : "Manual Control Active");

      // 3. Instead of fetchAllChats (which causes the bounce),
      // just trust the success and stay in the optimistic state.
      // Or, only fetch if you strictly need to sync other complex data.
    } catch (err) {
      // 4. Revert local state on error
      setChatList((prev) =>
        prev.map((chat) =>
          chat._id === selectedId
            ? {
                ...chat,
                aiAssistant: { ...chat.aiAssistant, isActive: !nextState },
              }
            : chat,
        ),
      );
      toast.error("Failed to sync AI status");
    } finally {
      setTogglingAi(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    // Resolve the target ID properly
    const targetUserId =
      activeApp?.userId?._id || activeApp?.userId || activeApp?._id;

    if (
      !admin?.email ||
      !selectedId ||
      !inputText.trim() ||
      isAiActive ||
      !targetUserId
    )
      return;

    const messageText = inputText;
    setInputText("");

    try {
      const formData = new FormData();
      formData.append("applicationId", selectedId);
      formData.append("userId", targetUserId);
      formData.append("text", messageText);
      formData.append("senderType", "admin");
      formData.append("senderName", admin?.name || "Administrator");
      formData.append("email", admin.email);

      const response = await chatAPI.sendMessage(formData);
      const socket = getSocket();
      socket.emit("sendMessage", {
        ...response.data,
        room: selectedId,
        applicationId: selectedId,
      });
      dispatch(fetchMessagesByUserId(targetUserId));
    } catch (err) {
      toast.error("Message failed");
      setInputText(messageText);
    }
  };

  console.log("current user chat account number", activeApp);

  return (
    <AdminLayout>
      <div className="relative flex h-[calc(100vh-140px)] bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden">
        {/* SIDEBAR: CONVERSATION LIST */}
        <div
          className={`${selectedId ? "hidden lg:flex" : "flex"} flex-col w-full lg:w-[400px] border-r border-slate-50`}
        >
          <div className="p-8 pb-4">
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter mb-6 uppercase italic">
              Inbox
            </h1>
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm outline-none font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-2 mt-4">
            {loadingList ? (
              <div className="p-10 text-center animate-pulse text-slate-300 font-bold uppercase text-xs tracking-widest">
                Syncing...
              </div>
            ) : (
              filteredUserList.map((chat) => (
                <div
                  key={chat._id}
                  onClick={() => setSelectedId(chat._id)}
                  className={`p-4 rounded-[24px] cursor-pointer flex items-center justify-between transition-all ${
                    selectedId === chat._id
                      ? "bg-slate-900 text-white shadow-lg scale-[1.02]"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center font-black ${
                        selectedId === chat._id
                          ? "bg-blue-600 text-white"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {chat.userName?.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold truncate text-sm">
                        {chat.userName}
                      </h3>
                      <p
                        className={`text-[11px] truncate opacity-60 ${selectedId === chat._id ? "text-slate-300" : "text-slate-500"}`}
                      >
                        {chat.lastMessageText ||
                          chat.loanAccountNumber ||
                          "Live Chat"}
                      </p>
                    </div>
                  </div>
                  {chat.aiAssistant?.isActive && (
                    <Bot size={12} className="text-blue-500" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* CHAT MAIN AREA */}
        {selectedId ? (
          <div className="flex-1 flex flex-col min-w-0 bg-white">
            <div className="px-6 py-5 border-b flex items-center justify-between z-20 bg-white">
              <div className="flex items-center gap-4 min-w-0">
                <button
                  onClick={() => setSelectedId(null)}
                  className="p-2 lg:hidden bg-slate-50 rounded-xl flex-shrink-0"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="min-w-0">
                  <h2 className="font-black text-slate-900 leading-none truncate">
                    {activeApp?.userName}
                  </h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase mt-1 truncate">
                    {activeApp?.loanAccountNumber || "Guest Session"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="flex items-center gap-2 bg-slate-100 p-1.5 px-3 rounded-2xl">
                  <span className="text-[9px] font-black uppercase text-slate-500 hidden sm:inline">
                    {isAiActive ? "Copilot" : "Manual"}
                  </span>

                  <button
                    onClick={handleToggleAI}
                    disabled={togglingAi}
                    className={`relative w-11 h-6 rounded-full transition-all flex items-center ${isAiActive ? "bg-blue-600" : "bg-slate-300"}`}
                  >
                    <div
                      className={`absolute w-4 h-4 bg-white rounded-full transition-all shadow-sm flex items-center justify-center ${isAiActive ? "left-6" : "left-1"}`}
                    >
                      {togglingAi && (
                        <Loader2
                          size={10}
                          className="text-blue-600 animate-spin"
                        />
                      )}
                    </div>
                  </button>
                </div>
                <button
                  onClick={() => setShowInfoSidebar(true)}
                  className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-blue-600 transition-colors"
                >
                  <Info size={20} />
                </button>
              </div>
            </div>

            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F8FAFC]"
            >
              {(Array.isArray(messages) ? messages : []).map((msg: any) => {
                const sType = msg.senderType?.toLowerCase();
                const isRight =
                  sType === "admin" || sType === "ai-bot" || sType === "bot";
                const isAi = sType === "ai-bot" || sType === "bot";
                return (
                  <div
                    key={msg._id || Math.random()}
                    className={`flex ${isRight ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] p-4 rounded-[24px] shadow-sm ${
                        sType === "admin"
                          ? "bg-slate-900 text-white rounded-tr-none"
                          : isAi
                            ? "bg-blue-600 text-white rounded-tr-none"
                            : "bg-white border border-slate-200 text-slate-700 rounded-tl-none"
                      }`}
                    >
                      {isAi && (
                        <div className="flex items-center gap-1 mb-1 opacity-70">
                          <Bot size={10} />
                          <span className="text-[9px] font-bold uppercase">
                            AI Copilot
                          </span>
                        </div>
                      )}

                      <div className="text-[13px] leading-relaxed font-medium break-words prose prose-sm prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.text || msg.message || msg.content || ""}
                        </ReactMarkdown>
                      </div>
                      <p className="text-[8px] mt-2 opacity-40 text-right font-bold">
                        {msg.createdAt
                          ? new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Just now"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-6 bg-white border-t">
              <form
                onSubmit={handleSendMessage}
                className={`flex items-center gap-3 p-2 rounded-[24px] border-2 transition-all ${isAiActive ? "bg-slate-50 opacity-50 pointer-events-none" : "bg-white border-blue-500/10 shadow-lg"}`}
              >
                <input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    isAiActive
                      ? "AI is handling this chat..."
                      : "Type message..."
                  }
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-3 outline-none px-4"
                  disabled={isAiActive}
                />
                <button
                  type="submit"
                  disabled={isAiActive || !inputText.trim()}
                  className="p-4 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 hidden lg:flex flex-col items-center justify-center bg-slate-50/50">
            <MessageCircle className="text-slate-300 mb-6" size={48} />
            <h2 className="text-xl font-black text-slate-900">
              Select a conversation
            </h2>
          </div>
        )}

        {/* INFO SIDEBAR: COVERS PAGE ON MOBILE, SLIDES IN ON DESKTOP */}
        <AnimatePresence>
          {showInfoSidebar && (
            <>
              {/* Overlay for mobile */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowInfoSidebar(false)}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
              />
              <motion.aside
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 right-0 z-50 w-full sm:w-[400px] lg:w-[380px] border-l bg-white shadow-[-20px_0_60px_-15px_rgba(0,0,0,0.1)] flex flex-col"
              >
                <div className="p-8 border-b flex justify-between items-center bg-white sticky top-0 z-10">
                  <h3 className="font-black uppercase text-slate-900 text-xs tracking-[0.2em]">
                    Application Intelligence
                  </h3>
                  <button
                    onClick={() => setShowInfoSidebar(false)}
                    className="p-3 bg-slate-100 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                  {/* Profile Header */}
                  <div className="bg-slate-900 rounded-[40px] p-8 text-center text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -mr-16 -mt-16 blur-2xl transition-all group-hover:bg-blue-600/20" />
                    <div className="w-20 h-20 bg-blue-600 rounded-[28px] mx-auto flex items-center justify-center text-3xl mb-4 font-black shadow-xl shadow-blue-600/20">
                      {activeApp?.userName?.charAt(0)}
                    </div>
                    <h3 className="font-black text-xl mb-1 truncate">
                      {activeApp?.userName}
                    </h3>
                    <p className="text-[11px] text-slate-400 uppercase font-bold tracking-tighter opacity-70 truncate">
                      {activeApp?.userEmail || activeApp?.email || "Guest User"}
                    </p>
                  </div>

                  {/* Details Grid */}
                  <div className="grid gap-3">
                    <InfoRow
                      label="ID"
                      value={activeApp?._id}
                      icon={<IdCard size={16} />}
                    />
                    <InfoRow
                      label="AI"
                      value={isAiActive ? "Active" : "Off"}
                      icon={<Bot size={14} />}
                    />
                    <InfoRow
                      label="Loan Account"
                      value={activeApp?.loanAccountNumber || "N/A"}
                      icon={<PanelsTopLeft size={16} />}
                    />
                    <InfoRow
                      label="Principal"
                      value={`$${activeApp?.amount?.toLocaleString() || 0}`}
                      icon={<DollarSign size={16} />}
                    />
                    <InfoRow
                      label="Loan Type"
                      value={activeApp?.loanType || "Personal"}
                      icon={<TypeIcon size={16} />}
                    />
                    <InfoRow
                      label="Status"
                      value={activeApp?.status || "Pending"}
                      icon={<Mail size={16} />}
                    />
                    <InfoRow
                      label="Duration"
                      value={`${activeApp?.durationMonths || 0} Months`}
                      icon={<Clock size={16} />}
                    />
                    <InfoRow
                      label="Interest"
                      value={`${activeApp?.interestRate || 0}%`}
                      icon={<Percent size={16} />}
                    />
                    <InfoRow
                      label="Employer"
                      value={activeApp?.employerName || "N/A"}
                      icon={<Briefcase size={16} />}
                    />
                    <InfoRow
                      label="Created At"
                      value={
                        activeApp?.createdAt
                          ? new Date(activeApp.createdAt).toLocaleDateString()
                          : "N/A"
                      }
                      icon={<Calendar size={16} />}
                    />
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="group flex items-center justify-between p-4 bg-slate-50 hover:bg-white rounded-[24px] border border-transparent hover:border-slate-100 hover:shadow-md hover:shadow-slate-200/50 transition-all duration-300">
      <div className="flex items-center gap-4 min-w-0">
        <div className="p-3 rounded-2xl bg-white text-slate-400 shadow-sm group-hover:text-blue-600 group-hover:scale-110 transition-all">
          {icon}
        </div>
        <div className="min-w-0">
          <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
            {label}
          </span>
          <span className="block text-sm font-black text-slate-900 truncate pr-2">
            {value}
          </span>
        </div>
      </div>
    </div>
  );
}
