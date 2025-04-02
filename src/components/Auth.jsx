import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLoginMutation, useRegisterMutation } from "../services/authSlice";
import { selectToken } from "../services/authSlice";
import { connectSocket, disconnectSocket } from "../socket";

function Auth() {
    const navigate = useNavigate();
    const token = useSelector(selectToken);

    useEffect(() => {
        if (token) {
            navigate("/home"); // Redirect authenticated users to Home
        }
    }, [token, navigate]);
    
    const [login, { error: loginError }] = useLoginMutation();
    const [register, { error: registerError }] = useRegisterMutation();

    // isLogin state to toggle from login and register user 
    const [isLogin, setIsLogin] = useState(true);
    const authEvent = isLogin ? "login" : "register";

    const altCopy = isLogin ? "Register for an account here" : "Already registered? Click here to login";

    // username and password state
    const [username, setUsername ] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [localError, setLocalError] = useState(null)

    async function authenticateFunction(event) {
        event.preventDefault();

        // Check password mismatch
        if (!isLogin && password !== password2) {
            setLocalError("Passwords do not match");
            return;
        }
        setLocalError(null);

        const loginMethod = isLogin ? login : register;
        const credentials = { username: username.trim(), password: password.trim() };  // Using trim() on username & password to prevent leading/trailing spaces.

        try {
            const result = await loginMethod(credentials).unwrap();
            const token = result.token;

            connectSocket(token);
            navigate("/home");
        } catch (e) {
            console.error("Authentication failed:", e);
            setLocalError(e?.data?.message || e?.error || "Authentication failed");

        }
    };

    // this function handels logouts. I dont know if i wanna use this yet.
    function handleLogout() {
        disconnectSocket(); // Disconnect socket on logout
        dispatch(logout());
        navigate("/");
    }

    return (
        <main>
            <h1>{isLogin ? "Login" : "Register"}</h1>
            <form onSubmit={ authenticateFunction }>
                <label>
                    Username:
                    <input 
                        placeholder="Username"
                        type="text" 
                        value={username} 
                        onChange={(event) => setUsername(event.target.value)} 
                        required
                        autoFocus
                    />
                </label>
                    
                <label>
                    Password:
                    <input
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete="current-password"
                        required
                    />
                </label>

                {!isLogin && (
                    <label>
                        Re-enter Password:
                        <input 
                            placeholder="Re-enter Password"
                            type="password"
                            value={password2}
                            onChange={(event) => setPassword2(event.target.value)}
                            autoComplete="new-password"
                            required
                        />
                    </label>
                )}
                
                <button type="submit" className="">{authEvent}</button>
            </form>
            <button type="button" onClick={() => setIsLogin(!isLogin)}>
                {altCopy}
            </button>

            {localError && <p role="alert">{localError}</p>} 
            {isLogin && loginError && <p role="alert">{loginError.data}</p>}
            {!isLogin && registerError && <p role="alert">{registerError.data}</p>}
        </main>
    );
}
export default Auth;