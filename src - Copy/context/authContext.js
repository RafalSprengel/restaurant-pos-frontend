import { createContext, useContext, useEffect, useState } from 'react';
import api from '../utils/axios.js';

const AuthContext = createContext();

export function useAuth(role = 'customer') {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error(`useAuth must be used within an AuthProvider`);
    }

    useEffect(() => {
        if (role) {
            context.checkAuthStatus(role); 
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

    const checkAuthStatus = async (role = 'customer') => {
        console.log('## role w checkAuthStatus: ', role);
        try {
            setLoading(true);
            const endpoint = role === 'staff' ? '/staff/session' : '/customers/session';
            const response = await api.get(endpoint, { withCredentials: true });
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
