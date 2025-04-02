import { io } from "socket.io-client";

let socket = null;

export function connectSocket(token) {
    if (!token) return null;

    if (!socket) {
        socket = io("http://localhost:3000", {
            auth: { token },
        });

        socket.on("connect", () => {
            console.log("Connected to WebSocket server:", socket.id);
        });

        socket.on("disconnect", (reason) => {
            console.log("Disconnected:", reason);
        });

        socket.on("connect_error", (error) => {
            console.error("Socket connection error:", error.message);
        });
    }

    return socket;
}

export function disconnectSocket() {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}
