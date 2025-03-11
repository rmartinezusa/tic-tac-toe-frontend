import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectToken } from "../services/authSlice";
import Games from "./Games";
import Players from "./Players";

function Home() {
    const navigate = useNavigate();
    const token = useSelector(selectToken); 

    useEffect(() => {
        if (!token) {
            navigate("/");
        }
    }, [token, navigate]);

    if (!token) return null;

    return (
        <main>
            <h1>Tic Tac Toe</h1>
            <Games />
            <Players />
        </main>
    );
}

export default Home;