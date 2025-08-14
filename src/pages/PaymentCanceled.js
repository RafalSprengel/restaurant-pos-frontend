import { useNavigate } from 'react-router-dom';
import { IconCircleX, IconArrowNarrowLeft } from '@tabler/icons-react';
import '../styles/payment-cancelled.scss';

const PaymentCancelled = () => {
    const navigate = useNavigate();

    return (
        <div className="payment-cancelled">
            <IconCircleX stroke={1} size={75} className='payment-cancelled__icon'/>
            <span className='payment-cancelled__thank-you'>Payment cancelled!</span>
            <span className='payment-cancelled__message'>Your payment was not successful. You can try again or return to the homepage.</span>
            
            <div className="payment-cancelled__back" onClick={() => navigate('/')}>
                <IconArrowNarrowLeft stroke={1} size={25} style={{paddingTop: '2px'}}/> &nbsp; BACK TO HOMEPAGE
            </div>
        </div>
    );
};

export default PaymentCancelled;