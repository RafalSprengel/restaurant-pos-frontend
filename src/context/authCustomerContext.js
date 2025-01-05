import { createContext, useContext, useEffect, useState } from 'react';
import api from '../utils/axios.js';

const CustomerAuthContext = createContext();

export function useCustomerAuth() {
    return useContext(CustomerAuthContext);
}

export const CustomerAuthProvider = ({ children }) => {
    const [customer, setCustomer] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [responseStatus, setResponseStatus] = useState(null);

    const checkAuthStatus = async () => {
        try {
            setLoading(true);
            const response = await api.get('/customers/customer', {
                withCredentials: true,
            });
            setResponseStatus(response.status);
            if (response.status === 200) {
                console.log(response.data);
                setCustomer(response.data);
                setIsAuthenticated(true);
                setError(null);
            } else {
                setIsAuthenticated(false);
                setCustomer(null);
                setError('Błąd autentykacji: ' + response.error);
            }
        } catch (error) {
            console.log('Error fetching auth status:', error.message);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const login = (customerData) => {
        setIsAuthenticated(true);
        setCustomer(customerData);
        setError(null);
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout-customer');
            
            setIsAuthenticated(false);
            setCustomer(null);
            setError(null);
            
        } catch (error) {
            console.error('Błąd podczas wylogowywania:', error);
            setError('Wystąpił błąd podczas wylogowywania');
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    return (
        <CustomerAuthContext.Provider value={{ isAuthenticated, customer, login, logout, error, loading, responseStatus }}>
            {children}
        </CustomerAuthContext.Provider>
    );
};
