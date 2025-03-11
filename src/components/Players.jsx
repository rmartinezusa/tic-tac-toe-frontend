import { useGetUsersQuery } from "../services/userSlice";

function Players(){

    const { data: users, isLoading, error } = useGetUsersQuery();

    console.log(users);

    if (isLoading) return <p>Loading profile...</p>;
    if (error) return <p>{error.data || "We have encountered an error..."}</p>

    return(
        <section>
            <h2>select player to start new game</h2>
            <ul>
                {users?.map((user) => (
                    <li key={user.id}>{user.username}</li>
                ))}
            </ul>
        </section>
    );
}
export default Players;