import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../socket";

function GameBoard() {
    // This file is just a placeholder for now....
    // I may not want to use this, but for now here it is...

    const { gameId } = useParams(); // Get game ID from the URL
    const [board, setBoard] = useState(Array(9).fill(null)); // Tic Tac Toe board
    const [currentTurn, setCurrentTurn] = useState(null); // Track the player's turn
    const [winner, setWinner] = useState(null); // Track the winner

    useEffect(() => {
        if (!gameId) return;

        // Join game room
        socket.emit("joinGame", { gameId });

        // Listen for game updates
        socket.on("gameUpdated", ({ board, turn }) => {
            setBoard(board);
            setCurrentTurn(turn);
        });

        // Listen for game over event
        socket.on("gameOver", ({ winner }) => {
            setWinner(winner);
        });

        // Cleanup listeners when unmounting
        return () => {
            socket.off("gameUpdated");
            socket.off("gameOver");
        };
    }, [gameId]);

    function handleMove(index) {
        if (!winner && board[index] === null) {
            socket.emit("makeMove", { gameId, index });
        }
    }

    return (
        <main>
            <h1>Game ID: {gameId}</h1>
            <h2>{winner ? `Winner: ${winner}` : `Turn: ${currentTurn}`}</h2>
            <div className="board">
                {board.map((cell, index) => (
                    <button key={index} onClick={() => handleMove(index)} disabled={cell !== null || winner}>
                        {cell}
                    </button>
                ))}
            </div>
        </main>
    );
}

export default GameBoard;
