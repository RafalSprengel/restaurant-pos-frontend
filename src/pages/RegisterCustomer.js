import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button } from '@mantine/core';
import '../styles/register.scss';
import api from '../utils/axios';

const RegisterCustomer = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    surname: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'phone') {
      newValue = newValue.replace(/[^\d+]/g, '');
      if (newValue.startsWith('+')) {
        newValue = '+' + newValue.slice(1).replace(/\+/g, '');
      } else {
        newValue = newValue.replace(/\+/g, '');
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setPasswordsMatch(false);
      setError('Passwords do not match');
      return;
    }

    setPasswordsMatch(true);
    setLoading(true);

    try {
      const response = await api.post(
        '/auth/register/customer',
        JSON.stringify({
          firstName: formData.firstName,
          surname: formData.surname,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const { token } = response.data;
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
          <label htmlFor="firstName" className="register__label">First name:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
            className="register__input"
          />
        </div>

        <div className="register__input-group">
          <label htmlFor="surname" className="register__label">Surname:</label>
          <input
            type="text"
            id="surname"
            name="surname"
            value={formData.surname}
            onChange={handleInputChange}
            required
            className="register__input"
          />
        </div>

        <div className="register__input-group">
          <label htmlFor="phone" className="register__label">Phone:</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="register__input"
          />
        </div>

        <div className="register__input-group">
          <label htmlFor="email" className="register__label">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="register__input"
          />
        </div>

        <div className="register__input-group">
          <label htmlFor="password" className="register__label">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className={`register__input ${!passwordsMatch ? 'register__input--error' : ''}`}
          />
        </div>

        <div className="register__input-group">
          <label htmlFor="confirmPassword" className="register__label">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
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
