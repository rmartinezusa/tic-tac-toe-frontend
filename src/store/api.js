import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      token && headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: ["User", "Interest", "Chats", "Messages"],
});

export default api;