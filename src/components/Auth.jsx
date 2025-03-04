import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation, useRegisterMutation } from "../services/authSlice";

function Auth() {
    const navigate = useNavigate();
    
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
            await loginMethod(credentials).unwrap();
            navigate("/home");
        } catch (e) {
            console.error("Authentication failed:", e);
            setLocalError(e?.data?.message || e?.error || "Authentication failed");

        }
    };

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