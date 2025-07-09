import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/register.scss';
import api from '../utils/axios';

const RegisterCustomer = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setPasswordsMatch(false);
      setError('Passwords do not match');
      return;
    }

    setPasswordsMatch(true);
    setLoading(true);

    try {
      const response = await api.post(
        '/auth/register/customer',
        JSON.stringify({ name, surname, email, phone, password }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const { token } = response.data;
      localStorage.setItem('jwtToken', token);
      alert('Registration successful! Please login to continue.');
      navigate('/customer/login');
    } catch (e) {
      if (e.response) {
        setError(e.response.data.error);
      } else {
        setError('Something went wrong :(');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    window.location.href = 'http://localhost:3001/auth/google';
  };

  return (
    <div className="register">
      <h1 className="register__title">Register</h1>
      {error && <p className="register__error">{error}</p>}
      <form onSubmit={handleRegister} className="register__form">
        <div className="register__input-group">
          <label htmlFor="name" className="register__label">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="register__input"
          />
        </div>

        <div className="register__input-group">
          <label htmlFor="surname" className="register__label">Surname:</label>
          <input
            type="text"
            id="surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
            className="register__input"
          />
        </div>

        <div className="register__input-group">
          <label htmlFor="phone" className="register__label">Phone:</label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="register__input"
          />
        </div>

        <div className="register__input-group">
          <label htmlFor="email" className="register__label">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="register__input"
          />
        </div>

        <div className="register__input-group">
          <label htmlFor="password" className="register__label">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={`register__input ${!passwordsMatch ? 'register__input--error' : ''}`}
          />
        </div>

        <div className="register__input-group">
          <label htmlFor="confirmPassword" className="register__label">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={`register__input ${!passwordsMatch ? 'register__input--error' : ''}`}
          />
        </div>

        <button
          type="submit"
          className="register__button"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Register'}
        </button>
      </form>

      <div className="register__alternative">
        <p>Or register with:</p>
        <button
          onClick={handleGoogleRegister}
          className="register__google-button"
          type="button"
        >
          <span className="register__icon register__icon--google" />
          Register with Google
        </button>
      </div>
    </div>
  );
};

export default RegisterCustomer;
