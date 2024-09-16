import '../styles/SingleDish.scss';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useShoppingCart } from '../context/ShoppingCartContext.js';

export const SingleDish = ({ singleDish }) => {
    const { getItemQuantity } = useShoppingCart();
    const [searchParams, setSearchParams] = useSearchParams();

    const handleClick = () => {
        if (singleDish.id) {
            setSearchParams({ product: singleDish.id }, { replace: false });
        } else {
            console.error('SingleDish component: Missing product ID.');
        }
    };

    return (
        <div className="single-dish" onClick={handleClick} role="button" tabIndex={0}>
            {Boolean(getItemQuantity(singleDish.id) > 0) && (
                <div className='single-dish__quantity'>
                    {getItemQuantity(singleDish.id)}
                </div>
            )}
            <img
                className='single-dish__img'
                alt={singleDish.name || 'Dish image'}
                src={process.env.PUBLIC_URL + singleDish.img}
            />
            <div className='single-dish__descWrap'>
                <div className='single-dish__title'>{singleDish.name}</div>
                <div className='single-dish__desc'>{singleDish.desc}</div>
                <div className='single-dish__timeAndRatingWrap'>
                    <div className='single-dish__timeWrap'>
                        <span className='material-symbols-outlined single-dish__timeIco'>
                            schedule
                        </span>
                        <div className='single-dish__time'>{singleDish.time} min</div>
                    </div>
                    <div className='single-dish__ratingWrap'>
                        <span className='material-symbols-outlined single-dish__ratingIco'>
                            star
                        </span>
                        <div className='single-dish__rating'>{singleDish.rating}</div>
                    </div>
                </div>
                <div className="single-dish__price">{singleDish.price} zł</div>
            </div>
        </div>
    );
};

export default SingleDish;
