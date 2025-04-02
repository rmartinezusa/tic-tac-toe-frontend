import { useGetUsersQuery } from "../services/userSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { connectSocket } from "../socket";
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
                const gameId = activeGameData.activeGame.id;
                alert("You already have an ongoing game with this player."); // I dont think i want this here but it'll stay for now.
                //  setSelectedOpponent(null); // Reset opponent selection. this line is probably incorrect!!! HERE!!!
                //socket.emit("joinGame", { activeGameData[activeGame],  userId }); // HERE!!!! I am probaly going to need some logic here to set correct IDs to correct playerX and playerO.
                socket.emit("joinGame", { gameId,  userId });

                navigate(`/board`);
                //navigate(`/board/${activeGameData.activeGame.id}`);
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
            navigate(`/board`);
            //navigate(`/board/${gameId}`);
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
                {users?.filter(user => user.id !== userId).map(user => (
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
