import { createContext, useContext, useEffect, useState } from 'react';
import api from '../utils/axios.js';

const StaffAuthContext = createContext();

export function useAuth() {
    return useContext(StaffAuthContext);
}

export const CustomerAuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [responseStatus, setResponseStatus] = useState(null);

    const checkAuthStatus = async () => {
        try {
            setLoading(true);
            const response = await api.get('/user', {
                withCredentials: true,
            });
            setResponseStatus(response.status);
            if (response.status === 200) {
                setUser(response.data);
                setIsAuthenticated(true);
                setError(null);
            } else {
                setIsAuthenticated(false);
                setUser(null);
                setError('Błąd autentykacji: ' + response.error);
            }
        } catch (error) {
            console.log('Error fetching auth status:', error.message);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const login = (userData) => {
        setIsAuthenticated(true);
        setUser(userData);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    return (
        <StaffAuthContext.Provider value={{ isAuthenticated, user, login, logout, error, loading, responseStatus }}>
            {children}
        </StaffAuthContext.Provider>
    );
};
