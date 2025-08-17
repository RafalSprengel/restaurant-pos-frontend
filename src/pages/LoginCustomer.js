import React, { useEffect, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import '../styles/login-customer.scss';
import { useAuth } from '../context/authContext';
import api from '../utils/axios';
import { handleApiError } from '../utils/handleApiError';
import { Alert } from '@mantine/core';
import { IconXboxX } from '@tabler/icons-react';

const LoginCustomer = () => {
     const navigate = useNavigate();
     const [email, setEmail] = useState('test@wp.pl');
     const [password, setPassword] = useState('1');
     const [error, setError] = useState(null);
     const [loading, setLoading] = useState(false);
     const { isAuthenticated, login } = useAuth();

     const handleLogin = async (e) => {
          e.preventDefault();
          setLoading(true);
          setError(null);
          try {
               const response = await api.post('/auth/login/customer', { email, password });
               login(response.data);
          } catch (err) {
               setError(handleApiError(err));
          } finally {
               setLoading(false);
          }
     };

     const handleGoogleLogin = () => {
          window.location.href = `https://demo1.rafalsprengel.com/api/v1/auth/google`;
     };

     const handleFacebookLogin = () => {
          window.location.href = `https://demo1.rafalsprengel.com/api/v1/auth/facebook`;
     };

     useEffect(() => {
          if (isAuthenticated) navigate('/customer', { replace: true });
     }, [isAuthenticated, navigate]);

     return (
          <div className="customer-login">
               <h1 className="customer-login__title">Sign in</h1>

               {error && (
                    <Alert
                         variant="light"
                         color="red"
                         radius="md"
                         title={error}
                         icon={<IconXboxX />}
                    />
               )}

               <form onSubmit={handleLogin} className="customer-login__form">
                    <div className="customer-login__input-group">
                         <label htmlFor="email" className="customer-login__label">Email:</label>
                         <input
                              type="email"
                              id="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                              className="customer-login__input"
                         />
                    </div>

                    <div className="customer-login__input-group">
                         <label htmlFor="password" className="customer-login__label">Password:</label>
                         <input
                              type="password"
                              id="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                              className="customer-login__input"
                         />
                    </div>

                    <button
                         type="submit"
                         className={`customer-login__button ${loading ? 'customer-login__button--loading' : ''}`}
                         disabled={loading}
                    >
                         {loading ? 'Loading...' : 'Login'}
                    </button>
               </form>

               <div className="customer-login__alt-login">
                    <p>Or log in with:</p>

                    <button
                         onClick={handleGoogleLogin}
                         className="customer-login__social-btn customer-login__social-btn--google"
                    >
                         <span className="customer-login__icon customer-login__icon--google" />
                         Login with Google
                    </button>

                    <button
                         onClick={handleFacebookLogin}
                         className="customer-login__social-btn customer-login__social-btn--facebook"
                    >
                         <span className="customer-login__icon customer-login__icon--facebook" />
                         Login with Facebook
                    </button>

                    <NavLink to="/customer/register" className="customer-login__link">
                         Not registered yet? Register now.
                    </NavLink>
                    <NavLink to="/" className="customer-login__link">
                         Back to Homepage.
                    </NavLink>
               </div>
          </div>
     );
};

export default LoginCustomer;
