import { createBrowserRouter } from "react-router-dom";

import Root from './layout/Root';

import Auth from "./components/Auth";
import Home from './components/Home';


const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children:[
            { path: "/", element:<Auth /> },
            { path: "/home", element:<Home /> }
        ]
    }
]); 






export default router;