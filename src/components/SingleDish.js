import '../styles/SingleDish.scss';
import { useShoppingCart } from '../context/ShoppingCartContext.js';

export const SingleDish = ({ singleDish }) => {
  const { getItemQuantity } = useShoppingCart();

  return (
    <div className="single-dish" role="button" tabIndex={0}>
      {Boolean(getItemQuantity(singleDish._id) > 0) && (
        <div className="single-dish__quantity">{getItemQuantity(singleDish._id)}</div>
      )}
      <img
        className="single-dish__img"
        alt={singleDish.name || 'Dish image'}
        src={process.env.PUBLIC_URL + singleDish.img}
      />
      <div className="single-dish__descWrap">
        <div className="single-dish__title">{singleDish.name}</div>
        <div className="single-dish__desc">{singleDish.desc}</div>
        <div className="single-dish__timeAndRatingWrap">
          <div className="single-dish__timeWrap">
            <span className="material-symbols-outlined single-dish__timeIco">schedule</span>
            <div className="single-dish__time">{singleDish.timeToPrep} min</div>
          </div>
          <div className="single-dish__ratingWrap">
            <span className="material-symbols-outlined single-dish__ratingIco">star</span>
            <div className="single-dish__rating">{singleDish.rating}</div>
          </div>
        </div>
        <div className="single-dish__price">{singleDish.price} zł</div>
      </div>
    </div>
  );
};

export default SingleDish;
