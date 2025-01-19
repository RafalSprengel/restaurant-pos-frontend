import { useNavigate } from 'react-router-dom';
import { useShoppingCart } from '../context/ShoppingCartContext.js';
import Modal from '../components/Modal.js';
import '../styles/Cart.scss';

export default function Cart({ isOpen, close }) {
    const {
        cartItems,
        closeCart,
        cartSummaryPrice,
        openDelConfirmModal,
        openDelAllConfirmModal,
        increaseCartQuantity,
        decreaseCartQuantity,
        getItemQuantity,
    } = useShoppingCart();
    const navigate = useNavigate();
    const handleClickGoToCheckout = () => {
        navigate('order/checkout');
        closeCart();
    };

    const SingleItem = ({ item }) => {
        return (
            <div className="cartItem__content__item">
                <div className="cartItem__content__item__img">
                    <img src={process.env.PUBLIC_URL + item.image} alt={item.name} />
                </div>
                <div className="cartItem__content__item__desc">
                    <div className="cartItem__content__item__desc__name">{item.name}</div>
                    <div className="cartItem__content__item__desc__details">{item.desc}</div>
                </div>
                <div className="cartItem__content__item__subtotal">
                    <div className="cartItem__content__item__subtotal__price">
                        &#163;
                        {item.price}
                    </div>
                    <div className="cartItem__content__item__subtotal__stepper">
                        <span className="cartItem__content__item__subtotal__stepper__minus" onClick={() => decreaseCartQuantity(item)}>
                            -
                        </span>
                        <span>{getItemQuantity(item._id)}</span>
                        <span className="cartItem__content__item__subtotal__stepper__plus" onClick={() => increaseCartQuantity(item)}>
                            +
                        </span>
                    </div>
                </div>
                <div className="cartItem__content__item__remove">
                    <span onClick={() => openDelConfirmModal(item)}>Remove</span>
                </div>
            </div>
        );
    };

    return (
        <Modal isOpen={isOpen} close={close}>
            <div className="cartItem">
                <div className="cartItem__header">
                    <div className="cartItem__header__left">YOUR CART</div>
                    {cartItems.length !== 0 && (
                        <>
                            <div className="cartItem__header__center" onClick={openDelAllConfirmModal}>
                                (Clear basket)
                            </div>
                        </>
                    )}

                    <div className="cartItem__header__right" onClick={closeCart}>
                        X
                    </div>
                </div>
                <div className="cartItem__content">
                    {cartItems.length === 0 ? (
                        <div className="cartItem__content__basketIsEmpty">Twój koszyk jest pusty</div>
                    ) : (
                        cartItems.map((item, index) => <SingleItem item={item} key={index} />)
                    )}
                </div>
                <div className="cartItem__footer">
                    <button className="button-outlined" onClick={closeCart}>
                        Back to shooping
                    </button>
                    {cartItems.length > 0 && (
                        <button className="button-contained" onClick={handleClickGoToCheckout}>
                            Proceed to Checkout | &#163;
                            {cartSummaryPrice()}
                        </button>
                    )}
                </div>
            </div>
        </Modal>
    );
}
