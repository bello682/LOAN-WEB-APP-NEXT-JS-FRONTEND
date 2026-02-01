// "use client";
// import React, { useEffect, useState } from "react";
// import { userAPI } from "@/lib/api";
// import { Bell, Circle, CheckCheck } from "lucide-react";
// import toast from "react-hot-toast";

// export const NotificationList = () => {
//   const [notifications, setNotifications] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   const loadNotifications = async () => {
//     try {
//       const res = await userAPI.getNotifications();
//       // Ensure we handle different possible API response shapes
//       const data = Array.isArray(res.data)
//         ? res.data
//         : res.data?.notifications || [];
//       setNotifications(data);
//     } catch (err) {
//       console.error("Failed to load notifications", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const markAsRead = async (id: string) => {
//     try {
//       await userAPI.markNotificationAsRead(id);
//       // Update local state to remove the blue dot immediately
//       setNotifications(
//         notifications.map((n) => (n._id === id ? { ...n, read: true } : n)),
//       );
//     } catch (err) {
//       console.error("Error marking notification as read");
//     }
//   };

//   useEffect(() => {
//     loadNotifications();
//   }, []);

//   if (loading)
//     return (
//       <div className="animate-pulse space-y-4">
//         {[1, 2, 3].map((i) => (
//           <div key={i} className="h-20 bg-gray-100 rounded-2xl" />
//         ))}
//       </div>
//     );

//   return (
//     <div className="max-w-2xl mx-auto space-y-6">
//       <div className="flex items-center justify-between">
//         <h2 className="text-2xl font-black text-[#002D62] uppercase italic">
//           Your Alerts
//         </h2>
//         <span className="text-[10px] font-black bg-blue-100 text-blue-600 px-3 py-1 rounded-full uppercase">
//           {notifications.filter((n) => !n.read).length} New
//         </span>
//       </div>

//       <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
//         <div className="divide-y divide-gray-50">
//           {notifications.length === 0 ? (
//             <div className="p-12 text-center">
//               <Bell className="mx-auto text-gray-200 mb-4" size={48} />
//               <p className="text-gray-400 font-medium">No notifications yet.</p>
//             </div>
//           ) : (
//             notifications.map((n) => (
//               <div
//                 key={n._id}
//                 onClick={() => !n.read && markAsRead(n._id)}
//                 className={`p-6 transition-all cursor-pointer flex gap-4 ${!n.read ? "bg-blue-50/30" : "hover:bg-gray-50"}`}
//               >
//                 <div className="mt-1">
//                   {!n.read ? (
//                     <Circle
//                       size={10}
//                       fill="#3b82f6"
//                       className="text-blue-500"
//                     />
//                   ) : (
//                     <CheckCheck size={16} className="text-gray-300" />
//                   )}
//                 </div>
//                 <div className="flex-1">
//                   <p
//                     className={`text-sm ${!n.read ? "font-bold text-gray-900" : "text-gray-500"}`}
//                   >
//                     {n.message}
//                   </p>
//                   <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-wider">
//                     {new Date(n.createdAt).toLocaleDateString(undefined, {
//                       day: "numeric",
//                       month: "short",
//                       year: "numeric",
//                     })}
//                   </p>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

"use client";
import React, { useEffect, useState } from "react";
import { userAPI } from "@/lib/api";
import {
  Bell,
  Circle,
  CheckCheck,
  AlertTriangle,
  RefreshCcw,
} from "lucide-react";
import toast from "react-hot-toast";

export const NotificationList = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  //   const loadNotifications = async () => {
  //     try {
  //       setLoading(true);
  //       setError(false);
  //       const res = await userAPI.getNotifications();

  //       // Handle the data shape carefully
  //       const data = Array.isArray(res.data)
  //         ? res.data
  //         : res.data?.notifications || [];

  //       setNotifications(data);
  //     } catch (err: any) {
  //       setError(true);
  //       // Use the toast here!
  //       toast.error(err.response?.data?.message || "Internal server error (500)");
  //       console.error("Failed to load notifications", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(false);

      // COMMENT THIS OUT FOR NOW SINCE BACKEND IS MISSING
      /*
    const res = await userAPI.getNotifications();
    const data = Array.isArray(res.data) ? res.data : res.data?.notifications || [];
    setNotifications(data);
    */

      // USE MOCK DATA INSTEAD
      setNotifications([
        {
          _id: "1",
          message:
            "Welcome to your new dashboard! Explore your loan options in the calculator tab.",
          read: false,
          createdAt: new Date().toISOString(),
        },
        {
          _id: "2",
          message:
            "Your profile is 80% complete. Add your bank details to speed up future applications.",
          read: true,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ]);
    } catch (err: any) {
      console.warn("API not ready yet, using mock data.");
    } finally {
      setLoading(false);
    }
  };
  const markAsRead = async (id: string) => {
    if (!id) return;
    try {
      await userAPI.markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n)),
      );
      toast.success("Marked as read");
    } catch (err) {
      toast.error("Could not update notification");
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  if (loading)
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-gray-100 rounded-2xl" />
        ))}
      </div>
    );

  if (error)
    return (
      <div className="text-center py-20 bg-red-50 rounded-[2rem] border border-red-100">
        <AlertTriangle className="mx-auto text-red-400 mb-4" size={40} />
        <h3 className="text-[#002D62] font-black uppercase tracking-tighter text-xl">
          System Error
        </h3>
        <p className="text-red-500/70 text-sm mb-6">
          The server encountered an error (500) while fetching alerts.
        </p>
        <button
          onClick={loadNotifications}
          className="inline-flex items-center gap-2 bg-[#002D62] text-white px-6 py-2 rounded-xl text-xs font-black uppercase hover:bg-blue-900 transition-all"
        >
          <RefreshCcw size={14} /> Retry Connection
        </button>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-[#002D62] uppercase italic">
          Your Alerts
        </h2>
        <span className="text-[10px] font-black bg-blue-100 text-blue-600 px-3 py-1 rounded-full uppercase">
          {notifications.filter((n) => !n.read).length} New
        </span>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-50">
          {notifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="mx-auto text-gray-200 mb-4" size={48} />
              <p className="text-gray-400 font-medium">No notifications yet.</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => !n.read && markAsRead(n._id)}
                className={`p-6 transition-all cursor-pointer flex gap-4 ${
                  !n.read ? "bg-blue-50/30" : "hover:bg-gray-50"
                }`}
              >
                <div className="mt-1">
                  {!n.read ? (
                    <Circle
                      size={10}
                      fill="#3b82f6"
                      className="text-blue-500"
                    />
                  ) : (
                    <CheckCheck size={16} className="text-gray-300" />
                  )}
                </div>
                <div className="flex-1">
                  <p
                    className={`text-sm ${!n.read ? "font-bold text-gray-900" : "text-gray-500"}`}
                  >
                    {n.message}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-wider">
                    {n.createdAt
                      ? new Date(n.createdAt).toLocaleDateString()
                      : "Recent"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
