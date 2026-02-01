import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = () => {
	if (!socket) {
		socket = io(process.env.BACKEND_URL || "http://localhost:8001", {
			transports: ["websocket"],
			withCredentials: true,
		});
	}
	return socket;
};
