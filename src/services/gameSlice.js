import api from "../store/api";

const gameApi = api.injectEndpoints({
  endpoints: (build) => ({
    getGames: build.query({
      query: () => "/games",
      providesTags: ["Game"],
    }),
    getGame: build.query({
      query: (id) => `/games/${id}`,
      providesTags: ["Game"],
    }),
    createGame: build.mutation({
      query: (players) => ({
        url: "/games",
        method: "POST",
        body: players,
      }),
      invalidatesTags: ["Game"],
    }),
  }),
});

export const { useGetGamesQuery, useGetGameQuery, useCreateGameMutation } = gameApi;
