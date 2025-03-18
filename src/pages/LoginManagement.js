import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/LoginManagement.scss';
import { useAuth } from '../context/authContext';
import api from '../utils/axios'; // Importowanie instancji axios

export default function StaffLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('admin@wp.pl');
    const [password, setPassword] = useState('123');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); // Dodanie stanu loading
    const { isAuthenticated, isLoading, login, user } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await api.post('/auth/login/mgmt', { email, password });
            const { user } = response.data;
            login(user);
            navigate('/management', {replace: true});
        } catch (err) {
            if (err.message && err.message.includes('Network Error')) {
                setError('Unable to connect to the server. Please try again later.');
            } else {
                const errorqq = new Error(); const stack = errorqq.stack.split('\n')[1];
                console.log('## err: ', err,' ', stack)
                setError(err.response?.data?.error || 'Error during login');
            }
        }finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isLoading && isAuthenticated) navigate('/management', {replace: true});
    }, [isLoading, isAuthenticated, navigate]);

    return (
        <div className="login-container">
            <h1>Management Login</h1>
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
            <br></br>
            <NavLink to="/" className="login-link">Back to Homepage</NavLink>
        </div>
    );
}
