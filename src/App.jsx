import { RouterProvider } from "react-router-dom";
import router from "./router";
import './App.css';
import './styles/Auth.css';
import './styles/Home.css';
import './styles/Players.css';
import './styles/Square.css';
import './styles/Games.css';
import './styles/GameBoard.css';

function App() {
    return <RouterProvider router={router} />;
}

export default App;
