import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useShoppingCart } from '../context/ShoppingCartContext.js';
import { IconCircleCheck, IconArrowNarrowLeft  } from '@tabler/icons-react';
import api from '../utils/axios';
import '../styles/payment-success.scss';

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
    const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);

    const fetchSession = async () => {
        try {
            const response = await api.get(`/stripe/session-status?session_id=${session_id}`);
            if (response.status === 200) {
                setSessionData(response.data);
                if (response.data.status === 'complete') {
                    setIsPaymentSuccessful(true);
                }
            } else {
                console.error('Failed to fetch session data:', response.data);
                setErrorMessage(response.data.error.toString());
            }
        } catch (error) {
            console.log(error);
            setErrorMessage('Error fetching session data. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            fetchSession();
        }, 2000);

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
        <div className="payment-success">
            {isPaymentSuccessful ? (
                <>
                    <IconCircleCheck stroke={1} size={70} className='payment-success__icon'/>
                    <span className='payment-success__thank-you'>Thank you!</span>
                    <span className='payment-success__message'>Your payment has been successfully processed.</span>
                </>
            ) : isLoading ? (
                <h4>Loading...</h4>
            ) : sessionData?.status === 'open' ? (
                <h4>Payment is in progress</h4>
            ) : errorMessage ? (
                <p>{errorMessage}</p>
            ) : null}

            {showRefreshButton && !errorMessage && !isPaymentSuccessful && (
                <button className="button-contained" onClick={fetchSession}>
                    Refresh payment status
                </button>
            )}
            
            {!isLoading && (
                <div className="payment-success__back" onClick={() => navigate('/')}>
                    <IconArrowNarrowLeft stroke={1} size={25} style={{paddingTop: '2px'}}/> &nbsp; BACK TO HOMEPAGE
                </div>
            )}
        </div>
    );
};

export default PaymentSuccess;