import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Pobierz token z URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            // Zapisz token w lokalnej pamięci
            localStorage.setItem('jwtToken', token);

            // Przekierowanie na stronę główną lub inną stronę aplikacji
            navigate('/dashboard');
        } else {
            // W przypadku braku tokena przekierowanie na stronę logowania
            navigate('/login');
        }
    }, [navigate]);

    return <p>Logging in...</p>;
};

export default AuthSuccess;
