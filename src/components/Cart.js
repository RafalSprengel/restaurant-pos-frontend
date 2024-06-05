import { useNavigate } from 'react-router-dom';
import { useShoppingCart } from '../context/ShoppingCartContext.js';
import Modal from '../components/Modal.js';
import '../styles/Cart.scss'
import meals from '../data/meals.json';

export default function Cart({ isOpen, close }) {
    const { cartItems, closeCart, clearBasket, cartSummaryPrice } = useShoppingCart()
    const navigate = useNavigate()
    const handleClickGoToCheckout = () => {
        navigate('order/checkout');
        closeCart()
    }

    const SingleItem = ({ item }) => {
        let product = meals.find((meal) => meal.id === item.id)
        const { increaseCartQuantity, decreaseCartQuantity, getItemQuantity } = useShoppingCart()
        return (
            <div className='cartItem__content__item'>
                <div className='cartItem__content__item__img'>
                    <img src={product.img} alt="" />
                </div>
                <div className='cartItem__content__item__desc'>
                    <div className='cartItem__content__item__desc__name'>{product.name}</div>
                    <div className='cartItem__content__item__desc__details'>{product.desc}</div>
                </div>
                <div className='cartItem__content__item__subtotal'>
                    <div className='cartItem__content__item__subtotal__price'>{product.price} zł</div>
                    <div className='cartItem__content__item__subtotal__stepper'>
                        <span className='cartItem__content__item__subtotal__stepper__minus' onClick={() => decreaseCartQuantity(item.id)}>-</span>
                        <span>{getItemQuantity(item.id)}</span>
                        <span className='cartItem__content__item__subtotal__stepper__plus' onClick={() => increaseCartQuantity(item.id)}>+</span>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <Modal isOpen={isOpen} close={close}>
            <div className='cartItem'>
                <div className='cartItem__header'>
                    <div className='cartItem__header__left'>KOSZYK</div>
                    <div className='cartItem__header__center' onClick={clearBasket}> (Wyczyść)</div>
                    <div className='cartItem__header__right' onClick={closeCart}>X</div>
                </div>
                <div className='cartItem__content'>
                    {cartItems.map((el, index) => <SingleItem item={el} key={index} />)}
                    {cartItems.length === 0 && <div className='cartItem__content__basketIsEmpty'>Twój koszyk jest pusty</div>}
                </div>
                <div className='cartItem__footer'>
                    <button className='button-outlined' onClick={closeCart}>KONTYNUUJ ZAKUPY</button>
                    {cartItems.length !== 0 && <button className='button-contained' onClick={handleClickGoToCheckout}>DO KASY | {cartSummaryPrice() + ' zł'}</button>}
                </div>
            </div>
        </Modal >
    )
}