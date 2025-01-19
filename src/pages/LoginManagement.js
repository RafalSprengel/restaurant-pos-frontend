import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginManagement.scss';
import { useAuth } from '../context/authContext';
import api from '../utils/axios'; // Importowanie instancji axios

export default function StaffLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('member@wp.pl');
    const [password, setPassword] = useState('123');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); // Dodanie stanu loading
    const { isAuthenticated, isLoading, login, user } = useAuth('staff');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true); // Ustawienie loading na true

        try {
            const response = await api.post('/auth/login-staff', { email, password });
            const { user } = response.data;
            login(user);
            navigate('/staff');
        } catch (err) {
            if (err.message && err.message.includes('Network Error')) {
                setError('Unable to connect to the server. Please try again later.');
            } else {
                setError(err.response?.data?.message || 'Error during login');
            }
        }finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isLoading && isAuthenticated) navigate('/staff');
    }, [isLoading, isAuthenticated]);

    return (
        <div className="login-container">
            <h1>Staff Login</h1>
            {isAuthenticated && user && <div>You are already logged in as {user.name}</div>}
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
                <button type="submit" className="login-button" disabled={loading}>
                    {loading ? 'Loading...' : 'Login'}
                </button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
}
