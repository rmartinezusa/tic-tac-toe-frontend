import { createSlice } from "@reduxjs/toolkit";

// Initialize the move slice
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

// Thunk function to handle moves (note the use of a dynamic socket from context)
export const makeMove = (gameId, playerId, position) => (dispatch, getState) => {
  const socket = getState().socket; 

  if (socket) {
    socket.emit("makeMove", { gameId, playerId, position });

    // Listen for response after making a move
    socket.once("moveMade", (move) => {
      dispatch(moveMade(move));
    });

    socket.once("error", (errorMsg) => {
      dispatch(moveError(errorMsg));
    });
  } else {
    dispatch(moveError("Socket is not connected"));
  }
};

// Listen for real-time moves when the component mounts
export const listenForMoves = () => (dispatch, getState) => {
  const socket = getState().socket; 

  if (socket) {
    socket.on("moveMade", (move) => {
      dispatch(moveMade(move));
    });

    socket.on("error", (errorMsg) => {
      dispatch(moveError(errorMsg));
    });
  } else {
    dispatch(moveError("Socket is not connected"));
  }
};

export default moveSlice.reducer;
