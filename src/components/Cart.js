import Modal from './Modal.js';
import { useShoppingCart } from '../context/ShoppingCartContext.js';
import { useNavigate } from 'react-router-dom';
import { GoTrash } from "react-icons/go";
import '../styles/cart.scss';
import { Group } from '@mantine/core';
import { useState } from 'react';
import ConfirmationModal from './ConfirmationModal.js';

export default function Cart({ isOpen, close }) {
     const {
          cartItems,
          closeCart,
          cartQuantity,
          cartSummaryPrice,
          increaseCartQuantity,
          decreaseCartQuantity,
          getItemQuantity,
          removeProductFromCart, // Odbieramy funkcję z kontekstu
          clearCart, // Odbieramy funkcję z kontekstu
     } = useShoppingCart();
     const navigate = useNavigate();

     const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
     const [confirmOptions, setConfirmOptions] = useState({
          title: '',
          message: '',
          onConfirm: () => { },
     });

     const closeConfirmModal = () => {
          setConfirmOptions({
               message: '',
               onConfirm: () => { },
          });
          setIsConfirmModalOpen(false);
     };

     const openDelConfirmModal = (product) => {
          setIsConfirmModalOpen(true);
          setConfirmOptions({
               message: `Czy na pewno chcesz usunąć "${product.name}" z koszyka?`,
               onConfirm: () => {
                    removeProductFromCart(product._id);
                    closeConfirmModal();
               },
          });
     };

     const openDelAllConfirmModal = () => {
          setIsConfirmModalOpen(true);
          setConfirmOptions({
               message: 'Czy na pewno chcesz usunąć wszystkie produkty z koszyka?',
               onConfirm: () => {
                    clearCart();
                    closeConfirmModal();
               },
          });
     };

     const handleClickGoToCheckout = () => {
          navigate('order/checkout');
          closeCart();
     };

     const SingleItem = ({ item }) => {
          return (
               <div className="cart-item">
                    <div className="cart-item__image-wrapper">
                         <img src={process.env.PUBLIC_URL + item.image} alt={item.name} />
                    </div>
                    <div className='cart-item__body'>
                         <div className="cart-item__details">
                              <Group justify="space-between" w='100%'>
                                   <div className="cart-item__name">{item.name}</div>
                                   <div className="cart-item__remove">
                                        <span onClick={() => openDelConfirmModal(item)}><GoTrash style={{ width: '20px', height: '20px', color: 'red' }} /></span>
                                   </div>
                              </Group>

                              <div className="cart-item__description">{item.desc}</div>
                         </div>
                         <div className="cart-item__subtotal">
                              <div className="cart-item__price"><span className='cart-item__price-pound-symbol'>&#163; </span>{item.price}</div>
                              <div className="cart-item__quantity-stepper">
                                   <span className="cart-item__quantity-stepper-button cart-item__quantity-stepper-button--minus" onClick={() => {
                                        if (getItemQuantity(item._id) === 1) {
                                             openDelConfirmModal(item);
                                        } else {
                                             decreaseCartQuantity(item);
                                        }
                                   }}>
                                        -
                                   </span>
                                   <span className="cart-item__quantity">{getItemQuantity(item._id)}</span>
                                   <span className="cart-item__quantity-stepper-button cart-item__quantity-stepper-button--plus" onClick={() => increaseCartQuantity(item)}>
                                        +
                                   </span>
                              </div>
                         </div>
                    </div>
               </div>
          );
     };

     return (
          <Modal isOpen={isOpen} close={close}>
               <div className="cart">
                    <div className="cart__header">
                         <div className="cart__header-title">Your cart ({cartQuantity} items)</div>
                         {cartItems.length !== 0 && (
                              <div className="cart__header-clear-all" onClick={openDelAllConfirmModal}>
                                   Clear cart
                              </div>
                         )}
                         <div className="cart__header-close" onClick={closeCart}>
                              X
                         </div>
                    </div>
                    <div className="cart__content">
                         {cartItems.length === 0 ? (
                              <div className="cart__empty-message">Twój koszyk jest pusty</div>
                         ) : (
                              cartItems.map((item, index) => <SingleItem item={item} key={index} />)
                         )}
                    </div>
                    <div className="cart__footer">
                         <button className="button-outlined cart__button" onClick={closeCart}>
                              Back to shopping
                         </button>
                         {cartItems.length > 0 && (
                              <button className="button-contained cart__button" onClick={handleClickGoToCheckout}>
                                   Go to checkout | &#163;{cartSummaryPrice().toFixed(2)}
                              </button>
                         )}
                    </div>
               </div>
               <ConfirmationModal
                    isOpen={isConfirmModalOpen}
                    close={closeConfirmModal}
                    message={confirmOptions.message}
                    onConfirm={() => confirmOptions.onConfirm()}
               />
          </Modal>
     );
}