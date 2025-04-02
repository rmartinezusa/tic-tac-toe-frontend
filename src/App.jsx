import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { connectSocket, disconnectSocket } from "./socket"; 
import './App.css';

function App() {
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
            connectSocket(storedToken);
        }

        return () => {
            disconnectSocket(); 
        };
    }, []);

    return <RouterProvider router={router} />;
}

export default App;
