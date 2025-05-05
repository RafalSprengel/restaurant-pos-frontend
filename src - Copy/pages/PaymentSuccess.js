import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useShoppingCart } from '../context/ShoppingCartContext.js';
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

     const fetchSession = async () => {
          try {
               const response = await api.get(`/stripe/session-status?session_id=${session_id}`);
               if (response.status === 200) {
                    setSessionData(response.data);
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
          <div className="payment-success">
               {isLoading && sessionData === null && <h4>Loading...</h4>}
               {sessionData?.status === 'open' && <h4>Payment is in progress</h4>}
               {sessionData?.status === 'complete' && <h4>Payment was successful!</h4>}
               {showRefreshButton && !errorMessage && (
                    <button className="button-contained" onClick={fetchSession}>
                         Refresh payment status
                    </button>
               )}
               {errorMessage && <p>{errorMessage}</p>}
               {!isLoading && (
                    <button className="button-contained" onClick={() => navigate('/')}>
                         Go back to homepage
                    </button>
               )}
          </div>
     );
};

export default PaymentSuccess;
