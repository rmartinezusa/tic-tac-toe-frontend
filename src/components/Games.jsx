import { useGetGamesQuery } from "../services/gameSlice";
import { useSelector } from "react-redux";
import { selectUserId } from "../services/authSlice";

function Games() {
    const userId = useSelector(selectUserId);
    const { data: games, isLoading, error } = useGetGamesQuery();

    if (isLoading) return <p>Loading games...</p>;
    if (error) return <p>Error loading games.</p>;

    console.log(games);
    console.log(userId);

    return (
        <section className="games-section">
            <h2 className="games-title">Last 5 Games</h2>
            <ul className="games-list">
                {games.map((game) => (
                    <a key={game.id} className="game-link">
                        <li className="game-item">
                            <p>
                                <strong>{game.playerX?.username}</strong> vs <strong>{game.playerO?.username}</strong>
                            </p>
                            <p>Game ID: {game.id}</p>
                            <p>{new Date(game.createdAt).toLocaleString()}</p>
                        </li>
                    </a>
                ))}
            </ul>
            <button className="player-card">view all games</button>
        </section>
    );
}

export default Games;