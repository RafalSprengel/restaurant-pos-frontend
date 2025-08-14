import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/login-management.scss';
import { useAuth } from '../context/authContext';
import api from '../utils/axios';

export default function StaffLogin() {
     const navigate = useNavigate();
     const [email, setEmail] = useState('admin@wp.pl');
     const [password, setPassword] = useState('123');
     const [error, setError] = useState(null);
     const [loading, setLoading] = useState(false);
     const { isAuthenticated, isLoading, login } = useAuth();

     const handleLogin = async (e) => {
          e.preventDefault();
          setError(null);
          setLoading(true);

          try {
               const response = await api.post('/auth/login/mgmt', { email, password });
               const { user } = response.data;
               login(user);
               navigate('/management', { replace: true });
          } catch (err) {
               if (err.message && err.message.includes('Network Error')) {
                    setError('Unable to connect to the server. Please try again later.');
               } else {
                    setError(err.response?.data?.error || 'Error during login');
               }
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          if (!isLoading && isAuthenticated) navigate('/management', { replace: true });
     }, [isLoading, isAuthenticated, navigate]);

     return (
          <div className="management-login">
               <h1 className="management-login__title">Management Login</h1>

               <form onSubmit={handleLogin} className="management-login__form">
                    <div className="management-login__input-group">
                         <label htmlFor="email" className="management-login__label">Email:</label>
                         <input
                              id="email"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                              className="management-login__input"
                         />
                    </div>

                    <div className="management-login__input-group">
                         <label htmlFor="password" className="management-login__label">Password:</label>
                         <input
                              id="password"
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                              className="management-login__input"
                         />
                    </div>

                    <button
                         type="submit"
                         className={`management-login__button ${loading ? 'management-login__button--loading' : ''}`}
                         disabled={loading}
                    >
                         {loading ? 'Loading...' : 'Login'}
                    </button>

                    {error && <p className="management-login__error">{error}</p>}
               </form>

               <NavLink to="/" className="management-login__link">
                    Back to Homepage
               </NavLink>
          </div>
     );
}
