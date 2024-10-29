import React, { useEffect, useState } from 'react';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                setError('Brak tokena. Proszę zalogować się.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:3001/user', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Nie można pobrać danych użytkownika.');
                }

                const data = await response.json();
                setUser(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = () => {
        // Usunięcie tokena i przekierowanie do strony logowania
        localStorage.removeItem('jwtToken');
        window.location.href = '/login'; // Przykładowa ścieżka do strony logowania
    };

    if (loading) {
        return <p>Ładowanie danych użytkownika...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div>
            <h1>Witaj, {user.name}!</h1>
            <p>Email: {user.email}</p>
            <button onClick={handleLogout}>Wyloguj się</button>
        </div>
    );
};

export default Dashboard;
