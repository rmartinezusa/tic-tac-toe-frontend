import { createSlice } from "@reduxjs/toolkit";
import {connectSocket} from "../socket"; 
const socket = connectSocket();

const moveSlice = createSlice({
  name: "move",
  initialState: {
    moves: [],
    error: null,
  },
  reducers: {
    moveMade: (state, { payload }) => {
      state.moves.push(payload);
    },
    moveError: (state, { payload }) => {
      state.error = payload;
    },
  },
});

// Actions
export const { moveMade, moveError } = moveSlice.actions;

// Thunk function to handle moves
export const makeMove = (gameId, playerId, position) => (dispatch) => {
  socket.emit("makeMove", { gameId, playerId, position });

  // Listen for response after making a move
  socket.once("moveMade", (move) => {
    dispatch(moveMade(move));
  });

  socket.once("error", (errorMsg) => {
    dispatch(moveError(errorMsg));
  });
};

// Listen for real-time moves when the component mounts
export const listenForMoves = () => (dispatch) => {
  socket.on("moveMade", (move) => {
    dispatch(moveMade(move));
  });

  socket.on("error", (errorMsg) => {
    dispatch(moveError(errorMsg));
  });
};

export default moveSlice.reducer;
