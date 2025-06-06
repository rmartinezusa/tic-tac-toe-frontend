
import { useGetGamesQuery } from "../services/gameSlice";

function Games() {
    const { data: games, isLoading, error } = useGetGamesQuery();

    if (isLoading) return <p>Loading games...</p>;
    if (error) return <p>Error loading games.</p>;

    return (
        <section>
            <h2 className="text-xl font-bold mb-4">Last 5 Games</h2>
            <ul className="space-y-2">
                {games.map((game) => (
                    <li key={game.id} className="border p-2 rounded shadow-sm">
                        <p>
                            <strong>{game.playerX?.username}</strong> vs <strong>{game.playerO?.username}</strong>
                        </p>
                        <p>Game ID: {game.id}</p>
                        <p>{new Date(game.createdAt).toLocaleString()}</p>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default Games;