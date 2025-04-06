import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.scss';
import api from '../utils/axios';

const Register = () => {
     const [name, setName] = useState('');
     const [surname, setSurname] = useState('');
     const [email, setEmail] = useState('');
     const [phone, setPhone] = useState('');
     const [password, setPassword] = useState('');
     const [error, setError] = useState(null);
     const [loading, setLoading] = useState(false);
     const navigate = useNavigate();

     const handleRegister = async (e) => {
          e.preventDefault();

          setLoading(true);
          setError(null);

          try {
               const response = await api.post('/auth/register/customer', JSON.stringify({ name, surname, email, phone, password }), {
                    headers: {
                         'Content-Type': 'application/json',
                    },
               });

               const { token } = response.data;
               localStorage.setItem('jwtToken', token);
               alert('Registration successful!, please login to continue');
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
          <div className="register-container">
               <h1 className="register-title">Register</h1>
               {error && <p className="register-error">{error}</p>}
               <form onSubmit={handleRegister} className="register-form">
                    <div className="register-inputGroup">
                         <label htmlFor="name">Name:</label>
                         <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="register-input" />
                    </div>
                    <div className="register-inputGroup">
                         <label htmlFor="surname">Surname:</label>
                         <input type="text" id="surname" value={surname} onChange={(e) => setSurname(e.target.value)} required className="register-input" />
                    </div>
                    <div className="register-inputGroup">
                         <label htmlFor="phone">Phone:</label>
                         <input type="text" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="register-input" />
                    </div>
                    <div className="register-inputGroup">
                         <label htmlFor="email">Email:</label>
                         <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="register-input" />
                    </div>
                    <div className="register-inputGroup">
                         <label htmlFor="password">Password:</label>
                         <input
                              type="password"
                              id="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                              className="register-input"
                         />
                    </div>
                    <button type="submit" className="register-button" disabled={loading}>
                         {loading ? 'Loading...' : 'Register'}
                    </button>
               </form>
               <div className="register-alternative">
                    <p>Or register with:</p>
                    <button onClick={handleGoogleRegister} className="register-googleButton">
                         <span className="register-icon google-icon" />
                         Register with Google
                    </button>
               </div>
          </div>
     );
};

export default Register;
