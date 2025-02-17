import { createBrowserRouter } from "react-router-dom";

import Root from "./layout/Root";

import Home from "./components/Home";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children:[
            {
                path: "/home",
                element:<Home />,
            }
        ]
    }
]); 
export default router;