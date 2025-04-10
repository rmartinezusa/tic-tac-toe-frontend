import { createBrowserRouter } from "react-router-dom";

import Root from './layout/Root';

import Auth from "./components/Auth";
import Home from './components/Home';
import Games from "./components/Games";
import GameBoard from "./components/GameBoard"
import Board from "./components/Board"


const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children:[
            { path: "/", element:<Auth /> },
            { path: "/home", element:<Home /> },
            { path: "/games", element:<Games /> },
            { path: "/gameboard/:gameId", element: <GameBoard /> },
            { path: "/board", element:<Board /> },
        ]
    }
]); 

export default router;