import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { selectUserId } from "../services/authSlice";
import { useGetUsersQuery } from "../services/userSlice";

import { useSocket } from "../context/SocketContext";

function Players() {
    const { data: users, isLoading, error } = useGetUsersQuery();
    const userId = useSelector(selectUserId);
    const navigate = useNavigate();
    const socket = useSocket();

    useEffect(() => {
        if (!socket) return;

        const handleGameStart = (data) => {
            console.log(`Game started: ${data.gameId}`);
            navigate(`/gameboard/${data.gameId}`);
        };

        socket.on("game-start", handleGameStart);

        return () => {
            socket.off("game-start", handleGameStart);
        };
    }, [socket, navigate]);

    const handleSelectPlayer = (opponentId) => {

        if (!socket || !userId) return;

        socket.emit("create-game", {
            opponentId,
            userId,
        });
    };

    return (
        <section>
            <h2>Select player to start a new game</h2>
            <ul>
                {
                    users?.filter(user => user.id !== userId).map(user => (
                        <li key={user.id}>
                            <button onClick={() => handleSelectPlayer(user.id)}>
                                {user.username}
                            </button>
                        </li>
                    ))
                }
            </ul>
        </section>        
    );
}

export default Players;
