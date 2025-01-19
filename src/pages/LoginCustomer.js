import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import '../styles/LoginCustomer.scss';
import { useAuth } from '../context/authContext';
import api from '../utils/axios';

const LoginCustomer = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('kowalski@wp.pl');
    const [password, setPassword] = useState('123');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated,isLoading,  login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
    
        try {
            const response = await api.post('/auth/login/customer', { email, password });
            const { customer } = response.data;
            login(customer);
            navigate('/customer');
        } catch (err) {
            if (err.message && err.message.includes('Network Error')) {
                setError('Unable to connect to the server. Please try again later.');
            } else {
                setError(err.response?.data?.message || 'Error during login');
            }
        } finally {
            setLoading(false);
        }
    };
    

    const handleGoogleLogin = () => {
        window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
    };

    const handleFacebookLogin = () => {
        window.location.href = `${process.env.REACT_APP_API_URL}/auth/facebook`;
    };

useEffect(()=>{
    if(isAuthenticated) navigate('/customer')
}, [isLoading, isAuthenticated])

    return (
        <div className="login-container">
            <h1 className="login-title">Sign in</h1>
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
                    Login with Google
                </button>
                <button onClick={handleFacebookLogin} className="login-facebookButton">
                    <span className="login-icon facebook-icon" />
                    Login with Facebook
                </button>
                <NavLink to="/customer/register" className="login-registerLink">
                    Not registered yet? Register now.
                </NavLink>
            </div>
        </div>
    );
};

export default LoginCustomer;
