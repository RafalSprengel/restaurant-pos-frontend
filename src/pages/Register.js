import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:3001/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, name }),
            });

            if (!response.ok) {
                throw new Error('Rejestracja nie powiodła się.');
            }

            const data = await response.json();
            const { token } = data;
            localStorage.setItem('jwtToken', token);

            navigate('/dashboard');
        } catch (err) {
            setError('Błąd rejestracji. Spróbuj ponownie.', err);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleRegister = () => {
        window.location.href = 'http://localhost:3001/auth/google';
    };

    return (
        <div>
            <h1>Rejestracja</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleRegister}>
                <div>
                    <label htmlFor="name">Imię:</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="password">Hasło:</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Ładowanie...' : 'Zarejestruj się'}
                </button>
            </form>
            <div>
                <p>Lub zarejestruj się przez:</p>
                <button onClick={handleGoogleRegister}>Zarejestruj przez Google</button>
            </div>
        </div>
    );
};

export default Register;
