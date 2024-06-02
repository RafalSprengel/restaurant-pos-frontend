import { useState } from 'react';
import '../styles/ProductCard.scss';
import { useShoppingCart } from '../context/ShoppingCartContext.js';
import Modal from '../components/Modal.js';

export default function ProductCard({ currentProduct: curr, isOpen, close }) {
    const { increaseCartQuantity, decreaseCartQuantity, getItemQuantity, showCart } = useShoppingCart()

    // const handleSubmit = (e) => {
    //     // e.preventDefault();
    //     // let storedCart = localStorage.getItem('cartItems');
    //     // let updatedCart = storedCart ? JSON.parse(storedCart) : [];
    //     // updatedCart.push(formData);
    //     // localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    //     close()
    // };
    const handleSubmit = () => {
        close();
        showCart()
    }

    return (
        <Modal isOpen={isOpen} close={close}>
            <div className="product">
                <form onSubmit={handleSubmit}>
                    <img src={curr.img} className='product__img' />
                    <div className='product__name'>{curr.name}</div>
                    <br></br>
                    <div className='product__desc'>{curr.desc}</div>
                    <br></br>
                    <div className='product__quantity'>
                        <span className='product__quantity__minus' onClick={() => decreaseCartQuantity(curr.id)}>-</span>
                        <span className='product__quantity__number'>{getItemQuantity(curr.id)}</span>
                        <span className='product__quantity__plus' onClick={() => increaseCartQuantity(curr.id)}>+</span>
                    </div>
                    <div className='product__buttons'>
                        <button className='product__buttons__back' onClick={close}>Wróć</button>
                        <button className='product__buttons__submit'>Przejdź do koszyka</button>
                    </div>
                </form>
            </div >
        </Modal>
    )
}