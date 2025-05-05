import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthSuccess = () => {
     const navigate = useNavigate();

     useEffect(() => {
          const urlParams = new URLSearchParams(window.location.search);
          const token = urlParams.get('token');

          if (token) {
               localStorage.setItem('jwtToken', token);
               navigate('/dashboard');
          } else {
               navigate('/login');
          }
     }, [navigate]);

     return <p>Logging in...</p>;
};

export default AuthSuccess;
