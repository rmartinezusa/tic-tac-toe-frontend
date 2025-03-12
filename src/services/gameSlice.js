import api from "../store/api";

const gameApi = api.injectEndpoints({
  endpoints: (build) => ({
    getGames: build.query({
      query: () => "/game",
      providesTags: ["Game"],
    }),
    getGame: build.query({
      query: (id) => `/game/${id}`,
      providesTags: ["Game"],
    }),
    createGame: build.mutation({
      query: (players) => ({
        url: "/game",
        method: "POST",
        body: players,
      }),
      invalidatesTags: ["Game"],
    }),
  }),
});

export const { useGetGamesQuery, useGetGameQuery, useCreateGameMutation } = gameApi;
