import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectToken } from "../services/authSlice";

function Home() {
    const navigate = useNavigate();
    const token = useSelector(selectToken); 

    useEffect(() => {
        if (!token) {
            navigate("/"); // Redirect to login if not authenticated
        }
    }, [token, navigate]);

    if (!token) return null;

    return (
        <main>
            <h1>Tic Tac</h1>
            <section>
                <h2>Last N Games</h2>
                <p>this is gonna be a list of games</p>
                <p>somthing like: userOne vs userTow: game id and date?</p>
            </section>
            <section>
                <h2>select player to start new game</h2>
                <p>userOne</p>
                <p>userTow</p>
                <p>userThree</p>
            </section>
        </main>
    );
}

export default Home;