import { createBrowserRouter } from "react-router-dom";

import Root from './layout/Root';

import Auth from "./components/Auth";
import Home from './components/Home';
import Games from "./components/Games";


const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children:[
            { path: "/", element:<Auth /> },
            { path: "/home", element:<Home /> },
            { path: "/games", element:<Games /> },
        ]
    }
]); 

export default router;