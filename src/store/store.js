import { configureStore } from "@reduxjs/toolkit";
import api from "./api";
import authReducer from "../services/authSlice";
import moveReducer from "../services/moveSlice";

const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        auth: authReducer,
        move: moveReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

export default store;