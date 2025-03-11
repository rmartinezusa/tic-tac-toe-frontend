import api from "../store/api";

const userApi = api.injectEndpoints({
    endpoints: (build) => ({
        getUsers: build.query({
            query: () => "/users",
            providesTags: ["User"],
        }),
        getMe: build.query({
            query: () => "/users/me",
            providesTags: ["User"],
        }),
        getUser: build.query({
            query: (id) => "/users/" + id,
            providesTags: ["User"],
        }),
    }),
});

export const {useGetUsersQuery, useGetMeQuery, useGetUserQuery} = userApi;