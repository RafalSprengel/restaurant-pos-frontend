import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import '../styles/Login.scss';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:3001/api/auth/login-customer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Login or password error. Please check your credentials.');
            }

            const data = await response.json();
            const { token, refreshToken } = data;

            localStorage.setItem('jwtToken', token);
            localStorage.setItem('jwtRefreshToken', refreshToken);

            navigate('/admin');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:3001/auth/google';
    };

    const handleFacebookLogin = () => {
        window.location.href = 'http://localhost:3001/auth/facebook';
    };

    return (
        <div className="login-container">
            <h1 className="login-title">Sing in</h1>
            {error && <p className="login-error">{error}</p>}
            <form onSubmit={handleLogin} className="login-form">
                <div className="login-inputGroup">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="login-input"
                    />
                </div>
                <div className="login-inputGroup">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="login-input"
                    />
                </div>
                <button type="submit" className="login-button" disabled={loading}>
                    {loading ? 'Loading...' : 'Login'}
                </button>
            </form>
            <div className="login-alternative">
                <p>Or log in with:</p>
                <button onClick={handleGoogleLogin} className="login-googleButton">
                    <span className="login-icon google-icon" />
                    Login withGoogle
                </button>
                <button onClick={handleFacebookLogin} className="login-facebookButton">
                    <span className="login-icon facebook-icon" />
                    Login with Facebook
                </button>
                <NavLink to="/register" className="login-registerLink">
                    Not registered yet? Register now.
                </NavLink>
            </div>
        </div>
    );
};

export default Login;
