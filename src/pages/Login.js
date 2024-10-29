import React, { useState } from 'react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault(); // Zablokowanie domyślnej akcji formularza

        setLoading(true);
        setError(null); // Resetowanie błędów

        try {
            const response = await fetch('http://localhost:3001/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            // Sprawdzenie, czy odpowiedź jest OK (status 200-299)
            if (!response.ok) {
                throw new Error('Błąd logowania. Sprawdź swoje dane.');
            }

            const data = await response.json();
            // Zakładamy, że serwer zwraca token w odpowiedzi
            const { token } = data;

            // Zapisz token do localStorage
            localStorage.setItem('jwtToken', token);

            // Możesz dodać przekierowanie do innej strony po zalogowaniu, np. do panelu użytkownika
            window.location.href = '/dashboard'; // Przykładowa ścieżka do dashboardu
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        // Przekierowanie do endpointu logowania Google
        window.location.href = 'http://localhost:3001/auth/google';
    };

    return (
        <div>
            <h1>Logowanie</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="password">Hasło:</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Ładowanie...' : 'Zaloguj się'}
                </button>
            </form>
            <div>
                <p>Lub zaloguj się przez:</p>
                <button onClick={handleGoogleLogin}>Zaloguj z Google</button>
            </div>
        </div>
    );
};

export default Login;
