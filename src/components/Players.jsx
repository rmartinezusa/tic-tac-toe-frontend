import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { selectUserId } from "../services/authSlice";
import { useGetUsersQuery } from "../services/userSlice";

import { useSocket } from "../context/SocketContext";

function Players() {
    const { data: users, isLoading, error } = useGetUsersQuery();
    const userId = useSelector(selectUserId);
    const [userStatus, setUserStatus] = useState({});
    const navigate = useNavigate();
    const socket = useSocket();

    useEffect(() => {
        if (!socket) return;

        const handleGameStart = (data) => {
            console.log(`Game started: ${data.gameId}`);
            navigate(`/gameboard/${data.gameId}`);
        };

        const handleUserStatus = ({ userId, status }) => {
            setUserStatus((prevStatus) => ({
                ...prevStatus,
                [userId]: status,
            }));
        };

        const handleOnlineUsers = ({ onlineUserIds }) => {
            const newStatuses = {};
          
            onlineUserIds.forEach((id) => {
                newStatuses[id] = "online";
            });
            setUserStatus((prev) => ({
                ...prev,
                ...newStatuses,
            }));
        };

        socket.on("game-start", handleGameStart);
        socket.on("user-status", handleUserStatus);
        socket.on("online-users", handleOnlineUsers);

        socket.emit("request-online-users");

        return () => {
            socket.off("game-start", handleGameStart);
            socket.off("user-status", handleUserStatus);
            socket.off("online-users", handleOnlineUsers);
        };
    }, [socket, navigate]);

    const handleSelectPlayer = (opponentId) => {

        if (!socket || !userId) return;

        socket.emit("create-game", {
            opponentId,
        });
    };

    return (
        <section>
            <h2 className="player-">Select player to start a new game</h2>
            <div className="player-grid">
                {
                users?.filter(user => user.id !== userId).map(user => (
                    <div key={user.id} className="player-card">
                        <h3>{user.username}</h3>
                        <p className={userStatus[user.id] === "online" ? "online" : "offline"}>
                            {userStatus[user.id] === "online" ? "🟢 Online" : "⚫ Offline"}
                        </p>
                        <button onClick={() => handleSelectPlayer(user.id)}>Start Game</button>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Players;
