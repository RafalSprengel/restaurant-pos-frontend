import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import '../styles/register-customer.scss';
import api from '../utils/axios';
import Modal from '../components/Modal.js';
import { IconCircleCheck, IconArrowNarrowLeft } from '@tabler/icons-react';

const RegisterCustomer = () => {
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(true);
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
        JSON.stringify({ firstName, surname, email, phone, password }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setIsSuccessModalOpen(true);
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
    window.location.href = `https://demo1.rafalsprengel.com/api/v1/auth/google`;
  };

  const onCloseSuccessMOdal = () => {
    setIsSuccessModalOpen(false);
    navigate('/customer/login');
  };

  return (
    <>
      <div className="register-customer">
        <h1 className="register-customer__title">Register</h1>
        {error && <p className="register-customer__error">{error}</p>}
        <form onSubmit={handleRegister} className="register-customer__form">
          <div className="register-customer__input-group">
            <label htmlFor="firstName" className="register-customer__label">First name:</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="register-customer__input"
            />
          </div>

          <div className="register-customer__input-group">
            <label htmlFor="surname" className="register-customer__label">Surname:</label>
            <input
              type="text"
              id="surname"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              required
              className="register-customer__input"
            />
          </div>

          <div className="register-customer__input-group">
            <label htmlFor="phone" className="register-customer__label">Phone:</label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="register-customer__input"
            />
          </div>

          <div className="register-customer__input-group">
            <label htmlFor="email" className="register-customer__label">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="register-customer__input"
            />
          </div>

          <div className="register-customer__input-group">
            <label htmlFor="password" className="register-customer__label">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`register-customer__input ${!passwordsMatch ? 'register-customer__input--error' : ''}`}
            />
          </div>

          <div className="register-customer__input-group">
            <label htmlFor="confirmPassword" className="register-customer__label">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={`register-customer__input ${!passwordsMatch ? 'register-customer__input--error' : ''}`}
            />
          </div>

          <button
            type="submit"
            className="register-customer__button"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Register'}
          </button>
        </form>

        <div className="register-customer__alternative">
          <p className="register-customer__alternative-text">Or register with:</p>
          <button
            onClick={handleGoogleRegister}
            className="register-customer__google-button"
            type="button"
          >
            <span className="register-customer__icon register-customer__icon--google" />
            Register with Google
          </button>
        </div>
         <NavLink to="/customer/login" className="register-customer__link">
                                 Already registered yet? Login now.
                            </NavLink>
                            <NavLink to="/" className="register-customer__link">
                                 Back to Homepage.
                            </NavLink>
      </div>
     <Modal isOpen={isSuccessModalOpen} onClose={onCloseSuccessMOdal}>
  <div className='register-customer__modal'>
    <IconCircleCheck stroke={1} size={70} className='register-customer__modal-icon' />
    <span className='register-customer__modal-thank-you'>Congratulations!</span>
    <span className='register-customer__modal-message'>Your account has been successfully created. Please log in to your account.</span>
    <div className="register-customer__modal-back" onClick={() => navigate('/customer/login')}>
      <IconArrowNarrowLeft stroke={1} size={25} style={{ paddingTop: '2px' }} /> &nbsp; BACK TO LOGIN PAGE
    </div>
  </div>
</Modal>
    </>
  );
};

export default RegisterCustomer;