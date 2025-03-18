import { useGetUsersQuery } from "../services/userSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import socket from "../socket";
import { selectUserId } from "../services/authSlice";
import { useCreateGameMutation } from "../services/gameSlice"

function Players() {
    const { data: users, isLoading, error } = useGetUsersQuery();
    const [createGameMutation, { isLoading: isCreatingGame, error: createGameError }] = useCreateGameMutation();
    const navigate = useNavigate();
    const userId = useSelector(selectUserId);
 
    if (isLoading) return <p>Loading players...</p>;
    if (error) return <p>{JSON.stringify(error.data) || "We have encountered an error..."}</p>;

    async function handleSelectPlayer(opponentId) {
        if (!userId) return console.error("User ID not found in state");

        try {
            const data = await createGameMutation({ playerXId: userId, playerOId: opponentId }).unwrap();
            const gameId = data.id;
            
            socket.emit("joinGame", { gameId, userId });
            navigate(`/game/${gameId}`);
        } catch (e) {
            console.error("Failed to create game:", e);
        }
    }

    return (
        <section>
            <h2>Select player to start a new game</h2>
            {isCreatingGame && <p>Creating game...</p>}
            {createGameError && <p>Error creating game: {createGameError.data.error || "Try again"}</p>}
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
