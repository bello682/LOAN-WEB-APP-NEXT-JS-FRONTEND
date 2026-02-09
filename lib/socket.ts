import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = () => {
	if (!socket) {
		// socket = io(process.env.BACKEND_URL || "http://localhost:8001", {
		socket = io(
			process.env.BACKEND_URL ||
				"https://loan-web-app-node-js-backend.onrender.com",
			{
				transports: ["websocket"],
				withCredentials: true,
			},
		);
	}
	return socket;
};
