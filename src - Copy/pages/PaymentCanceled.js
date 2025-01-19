import { useNavigate } from 'react-router-dom';

const PaymentCanceled = () => {
    const navigate = useNavigate();

    return (
        <div className="paymentCanceled">
            <div className="paymentCanceled__content">
                <div className="paymentCanceled__content__title">Payment Canceled</div>
                <div className="paymentCanceled__content__message">
                    <span>Your payment was canceled.</span>
                </div>
                <div className="paymentCanceled__content__button">
                    <button onClick={() => navigate('/')}>Back to Home</button>
                </div>
            </div>
        </div>
    );
};

export default PaymentCanceled;
