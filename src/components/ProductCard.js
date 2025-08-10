import Modal from '../components/Modal.js';
import { useShoppingCart } from '../context/ShoppingCartContext.js';
import '../styles/product-card.scss';

export default function ProductCard({ currentProduct: product, isOpen, close }) {
     const { increaseCartQuantity, decreaseCartQuantity, getItemQuantity, openCart } = useShoppingCart();
     const handleSubmit = () => {
          close();
          openCart();
     };

     if (!product) {
          console.error('Product information is missing.');
          return null;
     }

     return (
          <Modal isOpen={isOpen} close={close}>
               <div className="product-card">
                    <img src='/img/products/roma.jpg' alt={product.name} className="product-card__image" />
                    <div className="product-card__name">{product.name}</div>
                    {product.desc && <div className="product-card__description">{product.desc}</div>}
                    <div className="product-card__price">£{product.price}</div>

                    <div className='product-card__counter'>
                         <span className="product-card__counter--minus"
                              onClick={() => decreaseCartQuantity(product)}
                         >
                              -
                         </span>
                         <span className='product-card__counter--quantity'>
                              {getItemQuantity(product._id)}
                         </span>
                         <span className='product-card__counter--plus'
                              onClick={() => increaseCartQuantity(product)}
                         >
                              +
                         </span>

                    </div>

                    <div className="product-card__actions">
                         <button
                              type="button"
                              className="product-card__button product-card__button--back"
                              onClick={close}
                         >
                              Back
                         </button>
                         <button
                              type="button"
                              className="product-card__button product-card__button--submit"
                              onClick={handleSubmit}
                         >
                              Go to cart
                         </button>
                    </div>
               </div>
          </Modal>
     );
}