import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLoginMutation, useRegisterMutation } from "../services/authSlice";
import { selectToken } from "../services/authSlice";
import { useSocket } from "../context/SocketContext";

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
        <div className="center-sign-in">
            <h1 className="title-header">LiveTicTacToe</h1>
            <h2 className="auth-header">{isLogin ? "Login" : "Register"}</h2>
            <form className="flex-auth-container" onSubmit={ authenticateFunction }>
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
                
                <button className="auth-button" type="submit">{authEvent}</button>
            </form>

            <button className="auth-button register-button" type="button" onClick={() => setIsLogin(!isLogin)}>
                {altCopy}
            </button>
            {(loginError || registerError || localError) && (
                <p role="alert">
                    {localError || loginError?.data || registerError?.data}
                </p>
            )}
        </div>
    );
}
export default Auth;