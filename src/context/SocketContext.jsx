import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ token, children }) {
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef(null);

    useEffect(() => {
        if (token && !socketRef.current) {
            const socket = io("https://tic-tac-toe-backend-a6zz.onrender.com", {
                auth: { token },
                autoConnect: true,
            });

            socketRef.current = socket;

            socket.on("connect", () => {
                console.log("🔌 Connected:", socket.id);
                setIsConnected(true);
            });

            socket.on("disconnect", (reason) => {
                console.log("⚠️ Disconnected:", reason);
                setIsConnected(false);
            });

            socket.on("connect_error", (err) => {
                console.error("❌ Socket connection error:", err.message);
            });
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [token]);

    return (
        <SocketContext.Provider value={socketRef.current}>
            {children}
        </SocketContext.Provider>
    );
}
