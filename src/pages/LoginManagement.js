import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './login-management.scss';
import { useAuth } from '../context/authContext';
import api from '../utils/axios';
import { Alert, TextInput, PasswordInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconXboxX, IconAt, IconLock } from '@tabler/icons-react';

export default function StaffLogin() {
     const navigate = useNavigate();
     const { isAuthenticated, isLoading, login } = useAuth();
     const [error, setError] = React.useState(null);
     const [loading, setLoading] = React.useState(false);

     const form = useForm({
          initialValues: {
               email: 'admin@admin.com',
               password: '123456',
          },
          validate: {
               email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
               password: (value) => (value.length > 0 ? null : 'Password is required'),
          },
     });

     const handleLogin = async (values) => {
          setError(null);
          setLoading(true);

          try {
               const response = await api.post('/auth/login/mgmt', values);
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
               {error && <Alert
                    variant="light"
                    color="red"
                    radius="md"
                    title={error}
                    icon={<IconXboxX />}
               />}

               <form
                    onSubmit={form.onSubmit(handleLogin)}
                    className="management-login__form"
               >
                    <TextInput
                         label="Email"
                         placeholder="Your email"
                         rightSection={<IconAt size={18} />}
                         {...form.getInputProps('email')}
                         classNames={{
                              root: 'management-login__input-group',
                              input: `management-login__input ${form.errors.email ? 'management-login__input--error' : ''}`,
                              label: 'management-login__label',
                         }}
                    />

                    <PasswordInput
                         label="Password"
                         placeholder="Your password"
                         icon={<IconLock size={18} />}
                         {...form.getInputProps('password')}
                         classNames={{
                              root: 'management-login__input-group',
                              input: `management-login__input ${form.errors.password ? 'management-login__input--error' : ''}`,
                              label: 'management-login__label',
                         }}
                    />
                    <button
                         type="submit"
                         className={`management-login__button ${loading ? 'management-login__button--loading' : ''}`}
                         disabled={loading}
                    >
                         {loading ? 'Loading...' : 'Login'}
                    </button>
               </form>

               <NavLink to="/" className="management-login__link">
                    Back to Homepage
               </NavLink>
          </div>
     );
};
