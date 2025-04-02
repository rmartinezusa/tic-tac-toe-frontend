import { useState } from "react";
import "../styles/square.css";

// value will change to use RTK stor. Pobably...
function Square({ value, onSquareClick }) {
    return <button className="square" onClick={onSquareClick}>{value}</button>;
}
export default Square;