import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/StaffLogin.scss';

import { useAuth } from '../context/StaffAuthContext';

export default function StaffLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('member@wp.pl');
    const [password, setPassword] = useState('12345');
    const [error, setError] = useState(null);

    const { isAuthenticated, login, user } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error('Invalid email or password');
            } else {
                login(data);
                navigate('/admin');
            }
        } catch (err) {
            setError(err.message);
            console.error('Login error:', err);
        }
    };

    return (
        <div className="login-container">
            <h1>Staff Login</h1>
            <div>
                {isAuthenticated ? 'You are already logged in as ' + user.name : 'not logged in'}
            </div>
            <form onSubmit={handleLogin} className="login-form">
                <label className="login-label">
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="login-input"
                    />
                </label>
                <label className="login-label">
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="login-input"
                    />
                </label>
                <button type="submit" className="login-button">
                    Login
                </button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
}
