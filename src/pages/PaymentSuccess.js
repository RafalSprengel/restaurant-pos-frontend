import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useShoppingCart } from '../context/ShoppingCartContext.js';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const session_id = params.get('payment_intent');

    const { clearCart } = useShoppingCart();

    const [isLoading, setIsLoading] = useState(true);
    const [showRefreshButton, setShowRefreshButton] = useState(false);
    const [sessionData, setSessionData] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const fetchSession = async () => {
        try {
            const response = await fetch(`http://localhost:3001/session_status?session_id=${session_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const stripeSession = await response.json(); // Upewnij się, że zamieniasz odpowiedź na JSON
            if (response.ok) {
                setSessionData(stripeSession);
            } else {
                console.error('Failed to fetch session data:', stripeSession);
                setErrorMessage(stripeSession.error.toString());
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        //set how interval you want to fetch the session data
        const interval = setInterval(() => {
            fetchSession();
        }, 2000);

        // set how long you want to wait before clearing the interval
        const timeout = setTimeout(() => {
            clearInterval(interval);
            setIsLoading(false);
            setShowRefreshButton(true);
        }, 10 * 1000);

        if (sessionData?.status === 'complete' || errorMessage) {
            clearInterval(interval);
            clearTimeout(timeout);
        }

        if (sessionData?.status === 'complete') {
            clearCart();
        }

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [sessionData?.status, errorMessage]);

    return (
        <>
            {isLoading && sessionData === null && <h4>Loading...</h4>}
            {sessionData?.status === 'open' && <h4>Payment is in progress</h4>}
            {sessionData?.status === 'complete' && <h4>Payment was successful!</h4>}
            {showRefreshButton && !errorMessage && <button onClick={fetchSession}>Refresh payment status</button>}
            {errorMessage && <p>{errorMessage}</p>}
            <button onClick={() => navigate('/')}>Go back to homepage</button>
        </>
    );
};

export default PaymentSuccess;
