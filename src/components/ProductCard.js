import Modal from '../components/Modal.js';
import { useShoppingCart } from '../context/ShoppingCartContext.js';
import '../styles/ProductCard.scss';

export default function ProductCard({ currentProduct: product, isOpen, close }) {
  const { increaseCartQuantity, decreaseCartQuantity, getItemQuantity, openCart } = useShoppingCart();
  const handleSubmit = (e) => {
    e.preventDefault();
    close();
    openCart();
  };

  // Check if currentProduct is available and valid
  if (!product) {
    console.error('Product information is missing.');
    return null;
  }

  return (
    <Modal isOpen={isOpen} close={close}>
      <div className="product">
        <form onSubmit={handleSubmit}>
          <img src={process.env.PUBLIC_URL + product.img} alt={product.name} className="product__img" />
          <div className="product__name">{product.name}</div>
          {product.desc && <div className="product__desc">{product.desc}</div>}
          <div className="product__quantity">
            <span className="product__quantity__minus" onClick={() => decreaseCartQuantity(product)}>
              -
            </span>
            <span className="product__quantity__number">{getItemQuantity(product._id)}</span>
            <span className="product__quantity__plus" onClick={() => increaseCartQuantity(product)}>
              +
            </span>
          </div>
          <div className="product__buttons">
            <button type="button" className="product__buttons__back" onClick={close}>
              Wróć
            </button>
            <button type="submit" className="product__buttons__submit">
              Przejdź do koszyka
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
