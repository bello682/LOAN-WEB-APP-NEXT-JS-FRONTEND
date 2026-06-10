import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(
      process.env.BACKEND_URL ||
        "https://standard-loan-management-system-backend.onrender.com",
      // "http://localhost:8046",
      {
        transports: ["websocket"],
        withCredentials: true,
      },
    );
  }
  return socket;
};
