"use client";

import React, { useEffect, useState } from "react";
import { userAPI } from "@/lib/api";
import {
  Bell,
  CheckCheck,
  AlertTriangle,
  RefreshCcw,
  X,
  Calendar,
  CheckCircle2,
  Info,
} from "lucide-react";
import toast from "react-hot-toast";
import { getSocket } from "../../../lib/socket";
import { motion, AnimatePresence } from "framer-motion";

export const NotificationList = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [selectedNotification, setSelectedNotification] = useState<any>(null);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(false);

      const res = await userAPI.getNotifications();

      const data = res.data?.notifications || [];

      setNotifications(data);
    } catch (err: any) {
      setError(true);

      toast.error(
        err.response?.data?.message || "Failed to load notifications",
      );

      console.error("Failed to load notifications", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    if (!id) return;

    try {
      await userAPI.markNotificationAsRead(id);

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id
            ? {
                ...n,
                read: true,
              }
            : n,
        ),
      );

      toast.success("Marked as read");
    } catch (err) {
      toast.error("Could not update notification");
    }
  };

  console.log(notifications);

  useEffect(() => {
    loadNotifications();

    const socket = getSocket();

    socket.on("user_notification", (newNotif) => {
      setNotifications((prev) => [newNotif, ...prev]);

      toast.success("You have a new alert!");
    });

    socket.on("global_notification", (newNotif) => {
      setNotifications((prev) => [newNotif, ...prev]);

      toast("📢 " + newNotif.title, {
        duration: 5000,
        position: "top-right",
      });
    });

    return () => {
      socket.off("user_notification");
      socket.off("global_notification");
    };
  }, []);

  if (loading)
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="
              h-24
              rounded-3xl
              animate-pulse
              bg-gradient-to-r
              from-gray-100
              via-gray-50
              to-gray-100
            "
          />
        ))}
      </div>
    );

  if (error)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="
          text-center
          py-20
          bg-white
          rounded-[32px]
          border
          border-red-100
          shadow-lg
        "
      >
        <AlertTriangle className="mx-auto text-red-400 mb-4" size={50} />

        <h3 className="text-[#002D62] text-2xl font-black">System Error</h3>

        <p className="text-gray-500 mt-3 mb-8">
          The server encountered an error while fetching notifications.
        </p>

        <button
          onClick={loadNotifications}
          className="
            inline-flex
            items-center
            gap-2
            px-6
            py-3
            rounded-2xl
            bg-[#002D62]
            text-white
            font-semibold
            hover:scale-105
            transition
          "
        >
          <RefreshCcw size={16} />
          Retry Connection
        </button>
      </motion.div>
    );

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-[#002D62]">
              Notifications
            </h2>

            <p className="text-gray-500 mt-1">
              Stay updated with all system alerts and activities.
            </p>
          </div>

          <div className="flex gap-3">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4">
              <p className="text-xs uppercase text-blue-500 font-semibold">
                Unread
              </p>

              <h4 className="text-2xl font-black text-blue-700">
                {notifications.filter((n) => !(n.read || n.isRead)).length}
              </h4>
            </div>

            <div className="bg-gray-50 border rounded-2xl px-5 py-4">
              <p className="text-xs uppercase text-gray-500 font-semibold">
                Total
              </p>

              <h4 className="text-2xl font-black text-gray-700">
                {notifications.length}
              </h4>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div
          className="
            bg-white/90
            backdrop-blur-xl
            border
            border-white/20
            rounded-[32px]
            shadow-xl
            overflow-hidden
          "
        >
          {notifications.length === 0 ? (
            <div className="py-20 px-8 text-center">
              <Bell size={60} className="mx-auto text-gray-200 mb-5" />

              <h3 className="font-bold text-lg text-gray-700">
                No Notifications
              </h3>

              <p className="text-gray-400 mt-2">You're all caught up.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((n, index) => (
                <motion.div
                  key={n._id}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.05,
                  }}
                  whileHover={{
                    scale: 1.01,
                  }}
                  whileTap={{
                    scale: 0.99,
                  }}
                  onClick={() => {
                    setSelectedNotification(n);

                    if (!(n.read || n.isRead)) {
                      markAsRead(n._id);
                    }
                  }}
                  className={`
                    relative
                    cursor-pointer
                    p-5
                    transition-all
                    duration-300

                    ${
                      !(n.read || n.isRead)
                        ? "bg-gradient-to-r from-blue-50 to-indigo-50"
                        : "hover:bg-gray-50"
                    }
                  `}
                >
                  {!(n.read || n.isRead) && (
                    <div className="absolute left-0 top-0 h-full w-1 bg-blue-500" />
                  )}

                  <div className="flex gap-4">
                    <div
                      className={`
                        h-12
                        w-12
                        rounded-2xl
                        flex
                        items-center
                        justify-center
                        shrink-0

                        ${
                          !(n.read || n.isRead)
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-400"
                        }
                      `}
                    >
                      {n.category === "info" ? (
                        <Info size={20} />
                      ) : n.category === "warning" ? (
                        <AlertTriangle size={20} />
                      ) : (
                        <Bell size={20} />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4
                              className={`text-sm ${
                                !(n.read || n.isRead)
                                  ? "font-bold text-gray-900"
                                  : "font-semibold text-gray-700"
                              }`}
                            >
                              {n.title || "Notification"}
                            </h4>

                            <span
                              className={`
        px-2 py-1
        rounded-full
        text-[10px]
        font-bold
        uppercase

        ${
          n.category === "info"
            ? "bg-blue-100 text-blue-700"
            : n.category === "warning"
              ? "bg-yellow-100 text-yellow-700"
              : n.category === "success"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
        }
      `}
                            >
                              {n.category || "info"}
                            </span>
                          </div>

                          <p
                            className={`text-sm ${
                              !(n.read || n.isRead)
                                ? "text-gray-800"
                                : "text-gray-600"
                            }`}
                          >
                            {n.message}
                          </p>
                        </div>

                        {!(n.read || n.isRead) && (
                          <div className="h-3 w-3 rounded-full bg-blue-500 mt-2 shrink-0" />
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                        <Calendar size={12} />

                        {n.createdAt
                          ? new Date(n.createdAt).toLocaleString()
                          : "Recent"}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}

      <AnimatePresence>
        {selectedNotification && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNotification(null)}
              className="
                fixed
                inset-0
                bg-black/50
                backdrop-blur-sm
                z-50
              "
            />

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
                y: 30,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                y: 30,
              }}
              transition={{
                type: "spring",
                stiffness: 220,
                damping: 22,
              }}
              className="
                fixed
                left-1/2
                top-1/2
                -translate-x-1/2
                -translate-y-1/2
                z-50
                w-[95%]
                max-w-xl
              "
            >
              <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl">
                <div className="bg-gradient-to-r from-[#002D62] to-blue-600 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell size={24} />
                      <h3 className="text-xl font-bold">
                        Notification Details
                      </h3>
                    </div>

                    <button
                      onClick={() => setSelectedNotification(null)}
                      className="
                        h-10
                        w-10
                        rounded-full
                        bg-white/20
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                <div className="p-7 space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedNotification.title}
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Complete notification details
                    </p>
                  </div>

                  <div className="bg-gray-50 border rounded-2xl p-5">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Message
                    </p>

                    <p className="text-base text-gray-900 leading-8 font-medium">
                      {selectedNotification.message}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-blue-50 rounded-2xl p-4">
                      <p className="text-xs text-blue-500">Category</p>

                      <h4 className="font-bold text-blue-900 mt-1">
                        {selectedNotification.category || "-"}
                      </h4>
                    </div>

                    <div className="bg-purple-50 rounded-2xl p-4">
                      <p className="text-xs text-purple-500">Scope</p>

                      <h4 className="font-bold text-purple-900 mt-1">
                        {selectedNotification.scope || "-"}
                      </h4>
                    </div>

                    <div className="bg-green-50 rounded-2xl p-4">
                      <p className="text-xs text-green-500">Status</p>

                      <h4 className="font-bold text-green-900 mt-1">
                        {selectedNotification.read ? "Read" : "Unread"}
                      </h4>
                    </div>

                    <div className="bg-orange-50 rounded-2xl p-4">
                      <p className="text-xs text-orange-500">Date</p>

                      <h4 className="font-bold text-orange-900 mt-1">
                        {selectedNotification.createdAt
                          ? new Date(
                              selectedNotification.createdAt,
                            ).toLocaleDateString()
                          : "-"}
                      </h4>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 border">
                    <p className="text-xs text-slate-500 mb-2">
                      Full Timestamp
                    </p>

                    <p className="font-semibold text-slate-900">
                      {selectedNotification.createdAt
                        ? new Date(
                            selectedNotification.createdAt,
                          ).toLocaleString()
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
