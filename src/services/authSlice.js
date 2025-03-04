import { createSlice } from "@reduxjs/toolkit";
import api from "../store/api";

//auth endpoints: register, login
const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    //register
    register: builder.mutation({
      query: (credentials) => ({
        url: "/register",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    //login
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

//session token
const TOKEN_KEY = "token";

//store token in state and session
const storeToken = (state, { payload }) => {
  state.token = payload.token;
  sessionStorage.setItem(TOKEN_KEY, payload.token);
};

//slice for JWT from API
const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: sessionStorage.getItem(TOKEN_KEY),
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      sessionStorage.removeItem(TOKEN_KEY);
    },
  },
  //update token for mutations
  extraReducers: (builder) => {
    builder.addMatcher(api.endpoints.login.matchFulfilled, storeToken);
    builder.addMatcher(api.endpoints.register.matchFulfilled, storeToken);
  },
});

//exports
export const { logout } = authSlice.actions;
export const selectToken = (state) => state.auth.token;
export default authSlice.reducer;