import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetGameQuery } from "../services/gameSlice";
import { selectUserId } from "../services/authSlice";
import { useSocket } from "../context/SocketContext";
import Square from "./Square";
import "../styles/square.css";

function GameBoard() {
    const userId = useSelector(selectUserId);
    const { gameId } = useParams();
    const socket = useSocket();
    const navigate = useNavigate();
    const { data: gameData } = useGetGameQuery(gameId);
    const [board, setBoard] = useState(Array(9).fill(null));
    const [currentTurn, setCurrentTurn] = useState("X");
    const [winner, setWinner] = useState(null);
    const [playersOnline, setPlayersOnline] = useState(1);

    const playerSymbol = userId === gameData?.playerXId ? "X" : userId === gameData?.playerOId ? "O" : null;
    const isMyTurn = playerSymbol === currentTurn;

    useEffect(() => {
        if (!gameId || !socket) return;

        socket.emit("joinGame", { gameId });

        socket.on("gameUpdated", ({ board, turn }) => {
            setBoard(board);
            setCurrentTurn(turn);
        });

        socket.on("gameOver", ({ board, winner }) => {
            setWinner(winner);
            setBoard(board);
        });

        socket.on("playersInGame", ({ count }) => {
            setPlayersOnline(count);
        });

        return () => {
            socket.off("gameUpdated");
            socket.off("gameOver");
            socket.off("playersInGame");
        };
    }, [gameId, socket]);

    function handleMove(index) {
        if (!winner && board[index] === null && isMyTurn) {
            socket.emit("makeMove", { gameId, index, playerId: userId });
        }
    };

    function gameStatusMessage() {
        if (winner === null && board.every(cell => cell !== null)) {
            return "Game ended in a TIE";
        } else if (winner) {
            return `Winner: ${winner}`;
        } else {
            return `Turn: ${currentTurn}`;
        }
    };

    return (
        <main>
            <h1>Game ID: {gameId}</h1>
            <h2>{winner ? `Winner: ${winner}` : `Turn: ${currentTurn}`}</h2>
            <h2>{gameStatusMessage()}</h2>
            <h3>You are: {playerSymbol}</h3>
            <h3>Players Online: {playersOnline}/2</h3>

            <div className="board-row">
                {board.slice(0, 3).map((value, i) => (
                    <Square key={i} value={value} onSquareClick={() => handleMove(i)} disabled={value !== null || winner} />
                ))}
            </div>
            <div className="board-row">
                {board.slice(3, 6).map((value, i) => (
                    <Square key={i + 3} value={value} onSquareClick={() => handleMove(i + 3)} disabled={value !== null || winner} />
                ))}
            </div>
            <div className="board-row">
                {board.slice(6, 9).map((value, i) => (
                    <Square key={i + 6} value={value} onSquareClick={() => handleMove(i + 6)} disabled={value !== null || winner} />
                ))}
            </div>
            {
                winner !== null || board.every(cell => cell !== null) ? (
                    <button onClick={() => navigate("/home")}>Exit Game</button>
                ) : null
            }
        </main>
    );
}

export default GameBoard;
