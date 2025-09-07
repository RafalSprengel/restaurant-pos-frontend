import React, { useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import './login-customer.scss';
import { useAuth } from '../context/authContext';
import api from '../utils/axios';
import { handleApiError } from '../utils/handleApiError';
import { Alert, TextInput, PasswordInput } from '@mantine/core';
import { IconXboxX, IconAt, IconLock } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
// trigger deploy

const LoginCustomer = () => {
     const navigate = useNavigate();
     const { isAuthenticated, login } = useAuth();
     const [error, setError] = React.useState(null);
     const [loading, setLoading] = React.useState(false);

     const form = useForm({
          initialValues: { email: 'test@test.com', password: '123456' },
          validate: {
               email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : 'Invalid email'),
               password: (value) => (value ? null : 'Password is required'),
          },
     });

     const handleLogin = async (values) => {
          setError(null);
          setLoading(true);
          try {
               const response = await api.post('/auth/login/customer', values);
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
          <div className="login-customer">
               <h1 className="login-customer__title">Sign in</h1>

               {error && <Alert variant="light" color="red" radius="md" title={error} icon={<IconXboxX />} />}

               <form onSubmit={form.onSubmit(handleLogin)} className="login-customer__form">
                    <TextInput
                         label="Email"
                         placeholder="Your email"
                         rightSection={<IconAt size={18} />}
                         {...form.getInputProps('email')}
                         classNames={{
                              root: 'login-customer__input-group',
                              input: `login-customer__input ${form.errors.email ? 'login-customer__input--error' : ''}`,
                              label: 'login-customer__label',
                         }}
                    />

                    <PasswordInput
                         label="Password"
                         placeholder="Your password"
                         icon={<IconLock size={18} />}
                         {...form.getInputProps('password')}
                         classNames={{
                              root: 'login-customer__input-group',
                              input: `login-customer__input ${form.errors.password ? 'login-customer__input--error' : ''}`,
                              label: 'login-customer__label',
                         }}
                    />

                    <button
                         type="submit"
                         className={`login-customer__button button-panel ${loading ? 'login-customer__button--loading' : ''}`}
                         disabled={loading}
                    >
                         {loading ? 'Loading...' : 'Login'}
                    </button>
               </form>

               <div className="login-customer__alt-login">
                    <p>Or log in with:</p>

                    <button onClick={handleGoogleLogin} className="login-customer__social-btn login-customer__social-btn--google">
                         <span className="login-customer__icon login-customer__icon--google" />
                         &nbsp; Login with Google
                    </button>

                    <button onClick={handleFacebookLogin} className="login-customer__social-btn login-customer__social-btn--facebook">
                         <span className="login-customer__icon login-customer__icon--facebook" />
                         &nbsp; Login with Facebook
                    </button>

                    <NavLink to="/customer/register" className="login-customer__link">
                         Not registered yet? Register now.
                    </NavLink>
                    <NavLink to="/" className="login-customer__link">
                         Back to Homepage.
                    </NavLink>
               </div>
          </div>
     );
};

export default LoginCustomer;
