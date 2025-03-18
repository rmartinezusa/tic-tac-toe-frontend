import { createSlice } from "@reduxjs/toolkit";
import api from "../store/api";
import { jwtDecode } from "jwt-decode";

// auth endpoints: register, login
const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // register
    register: builder.mutation({
      query: (credentials) => ({
        url: "/register",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    // login
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;

// session token
const TOKEN_KEY = "token";

// Function to check if the token is expired
function isTokenExpired(token) {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now(); 
  } catch (error) {
    return true;
  }
};

// store token in state and session
function storeToken(state, { payload }) {
  const token = payload.token;
  if (isTokenExpired(token)) {
    state.token = null;
    state.userId = null;
    sessionStorage.removeItem(TOKEN_KEY);
  } else {
    state.token = token;
    state.userId = decoded.id;
    sessionStorage.setItem(TOKEN_KEY, token);
  }
};

// slice for JWT from API
const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: sessionStorage.getItem(TOKEN_KEY),
    userId: sessionStorage.getItem(TOKEN_KEY) ? jwtDecode(sessionStorage.getItem(TOKEN_KEY)).id : null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.userId = null;
      sessionStorage.removeItem(TOKEN_KEY);
    },
  },
  // update token for mutations
  extraReducers: (builder) => {
    builder.addMatcher(api.endpoints.login.matchFulfilled, storeToken);
    builder.addMatcher(api.endpoints.register.matchFulfilled, storeToken);
  },
});

// exports
export const { logout } = authSlice.actions;
export const selectToken = (state) => state.auth.token;
export const selectUserId = (state) => state.auth.userId;
export default authSlice.reducer;
