import { useGetUsersQuery } from "../services/userSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import socket from "../socket";
import { selectUserId } from "../services/authSlice";
import { useCreateGameMutation, useCheckActiveGameQuery } from "../services/gameSlice";
import { useState, useEffect } from "react";
import { skipToken } from "@reduxjs/toolkit/query";

function Players() {
    const { data: users, isLoading, error } = useGetUsersQuery();
    const [createGameMutation, { isLoading: isCreatingGame, error: createGameError }] = useCreateGameMutation();
    const navigate = useNavigate();
    const userId = useSelector(selectUserId);

    const [selectedOpponent, setSelectedOpponent] = useState(null);

    // Fetch active game data when an opponent is selected
    const { data: activeGameData, isFetching: isCheckingGame } = useCheckActiveGameQuery(
        selectedOpponent ? { playerXId: userId, playerOId: selectedOpponent } : skipToken
    );

    useEffect(() => {
        if (selectedOpponent && !isCheckingGame) {
            if (activeGameData?.activeGame) {
                alert("You already have an ongoing game with this player.");
                setSelectedOpponent(null); // Reset opponent selection
                return;
            }

            createNewGame(selectedOpponent);
        }
    }, [selectedOpponent, activeGameData, isCheckingGame]);

    function handleSelectPlayer(opponentId) {
        if (!userId) return console.error("User ID not found in state");
        setSelectedOpponent(opponentId);
    }

    async function createNewGame(opponentId) {
        try {
            const data = await createGameMutation({ playerXId: userId, playerOId: opponentId }).unwrap();
            const gameId = data.id;

            socket.emit("joinGame", { gameId, userId });
            navigate(`/games/${gameId}`);
        } catch (e) {
            console.error("Failed to create game:", e);
        }
    }

    if (isLoading) return <p>Loading players...</p>;
    if (error) return <p>{JSON.stringify(error.data) || "We have encountered an error..."}</p>;

    return (
        <section>
            <h2>Select player to start a new game</h2>
            {isCreatingGame && <p>Creating game...</p>}
            {createGameError && <p>Error creating game: {createGameError.data.error || "Try again"}</p>}
            {isCheckingGame && <p>Checking for active games...</p>}
            <ul>
                {users?.map((user) => (
                    <li key={user.id}>
                        <button onClick={() => handleSelectPlayer(user.id)}>
                            {user.username}
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default Players;
