import { createContext, useContext, useEffect, useState } from 'react';
import api from '../utils/axios.js';

const AuthContext = createContext();

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error(`useAuth must be used within an AuthProvider`);
    }

    useEffect(() => {
        if (!context.user) {
            context.checkAuthStatus();
        }
    }, []); 

    return {
        ...context,
    };
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const checkAuthStatus = async () => {
        try {
            setLoading(true);
            const response = await api.get('/auth/session');
            if (response.status === 200) {
                setUser(response.data);
                setIsAuthenticated(true);
                setError(null);
            } else {
                throw new Error('Unauthorized');
            }
        } catch (err) {
            setUser(null);
            setIsAuthenticated(false);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const login = (userData) => {
        setIsAuthenticated(true);
        setUser(userData);
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (err) {
            console.error('Error during logout:', err.message);
        } finally {
            setIsAuthenticated(false);
            setUser(null);
        }
    };

    const setAuthStatus = (status) => {
        setIsAuthenticated(status);
    };

    useEffect(() => {
        checkAuthStatus();
        api.setIsAuthenticated = setAuthStatus;
        api.logout = logout;
    }, []);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                login,
                logout,
                error,
                isLoading,
                checkAuthStatus,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
