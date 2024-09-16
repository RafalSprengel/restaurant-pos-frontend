import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useShoppingCart } from '../context/ShoppingCartContext.js';
import Modal from '../components/Modal.js';
import '../styles/Cart.scss';
import meals from '../data/meals.json';

export default function Cart({ isOpen, close }) {
    const { cartItems, closeCart, clearBasket, cartSummaryPrice, openDelConfirmModal, openDelAllConfirmModal } = useShoppingCart();
    const navigate = useNavigate();

    const handleClickGoToCheckout = () => {
        navigate('order/checkout');
        closeCart();
    };

    const SingleItem = ({ item }) => {
        const { increaseCartQuantity, decreaseCartQuantity, getItemQuantity } = useShoppingCart();
        const product = meals.find((meal) => meal.id === item.id);

        if (!product) {
            console.error(`Product with id ${item.id} not found`);
            return null;
        }

        return (
            <div className='cartItem__content__item'>
                <div className='cartItem__content__item__img'>
                    <img src={process.env.PUBLIC_URL + product.img} alt={product.name} />
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
                <div className='cartItem__content__item__remove'>
                    <span onClick={() => openDelConfirmModal(item.id)}>Usuń</span>
                </div>
            </div>
        );
    };

    return (
        <Modal isOpen={isOpen} close={close}>
            <div className='cartItem'>
                <div className='cartItem__header'>
                    <div className='cartItem__header__left'>KOSZYK</div>
                    <div className='cartItem__header__center' onClick={openDelAllConfirmModal}>(Wyczyść)</div>
                    <div className='cartItem__header__right' onClick={closeCart}>X</div>
                </div>
                <div className='cartItem__content'>
                    {cartItems.length === 0 ? (
                        <div className='cartItem__content__basketIsEmpty'>Twój koszyk jest pusty</div>
                    ) : (
                        cartItems.map((item, index) => <SingleItem item={item} key={index} />)
                    )}
                </div>
                <div className='cartItem__footer'>
                    <button className='button-outlined' onClick={closeCart}>KONTYNUUJ ZAKUPY</button>
                    {cartItems.length > 0 && (
                        <button className='button-contained' onClick={handleClickGoToCheckout}>
                            DO KASY | {cartSummaryPrice()} zł
                        </button>
                    )}
                </div>
            </div>
        </Modal>
    );
}
