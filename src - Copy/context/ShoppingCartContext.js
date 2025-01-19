import { createContext, useContext, useEffect, useState } from 'react';
import { useLocalStorageWithValidation } from '../hooks/useLocalStorageWithValidation.js';
import Cart from '../components/Cart.js';
import ProductCard from '../components/ProductCard.js';
import ConfirmationModal from '../components/ConfirmationModal.js';

export const ShoppingCartContext = createContext();

export function useShoppingCart() {
    return useContext(ShoppingCartContext);
}

export function ShoppingCartProvider({ children }) {
    const [cartItems, setCartItems] = useLocalStorageWithValidation('shopping-cart', []);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isProductOpen, setIsProductOpen] = useState(false);
    const [currProduct, setCurrentProduct] = useState([]);

    const [confirmOptions, setConfirOptions] = useState({
        title: '',
        message: '',
        onConfirm: () => {},
    });

    const openProduct = (id) => {
        setIsProductOpen(true);
        setCurrentProduct(id);
    };
    const closeProduct = () => setIsProductOpen(false);
    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    const openDelConfirmModal = (product) => {
        setIsConfirmModalOpen(true);
        setConfirOptions({
            message: (
                <div>
                    <h3>Czy chcesz usunąć ten produkt z koszyka ?</h3>
                    <h3>{product.name}</h3>
                </div>
            ),
            onConfirm: () => {
                removeProductFromCart(product._id);
                closeConfirmModal();
                setIsProductOpen(false);
            },
        });
    };

    const openDelAllConfirmModal = () => {
        setIsConfirmModalOpen(true);
        setConfirOptions({
            message: 'Czy chcesz wszystkie produkty z koszyka?',
            onConfirm: () => {
                clearCart();
                closeConfirmModal();
            },
        });
    };

    const closeConfirmModal = () => {
        setConfirOptions({
            message: '',
            onConfirm: () => {},
        });
        setIsConfirmModalOpen(false);
    };

    function increaseCartQuantity(product) {
        setCartItems((curr) => {
            if (curr.find((el) => el._id === product._id)) {
                //when element exists
                return curr.map((el) => {
                    if (el._id === product._id)
                        return { ...el, quantity: el.quantity + 1 };
                    else return el;
                });
            } else return [...curr, { ...product, quantity: 1 }]; //when not element with this id already exists
        });
    }

    function decreaseCartQuantity(product) {
        if (
            cartItems.find((el) => el._id === product._id)?.quantity ===
            1 /*when el.quantity is just 1*/
        ) {
            openDelConfirmModal(product);
        } else {
            // when el.quantity is higher then 1
            setCartItems((curr) => {
                return curr.map((el) => {
                    if (el._id === product._id)
                        return { ...el, quantity: el.quantity - 1 };
                    else return el;
                });
            });
        }
    }

    function removeProductFromCart(removedItemId) {
        setCartItems((curr) => {
            const newTab = curr.filter((el) => el._id !== removedItemId);
            return newTab;
        });
    }

    const clearCart = () => setCartItems([]);

    const getItemQuantity = (id) => {
        const item = cartItems.find((el) => el._id === id);
        return item ? item.quantity : 0;
    };

    const cartQuantity = cartItems.reduce(
        (quantity, item) => item.quantity + quantity,
        0
    );

    const cartSummaryPrice = () => {
        return cartItems.reduce((accumulator, currentValue) => {
            const storeItem = cartItems.find((el) => el._id === currentValue._id);
            return (
                accumulator +
                parseFloat(storeItem.price) * parseFloat(currentValue.quantity)
            );
        }, 0);
    };

    return (
        <ShoppingCartContext.Provider
            value={{
                increaseCartQuantity,
                decreaseCartQuantity,
                clearCart,
                cartQuantity,
                cartSummaryPrice,
                getItemQuantity,
                openCart,
                openDelConfirmModal,
                openDelAllConfirmModal,
                closeCart,
                openProduct,
                cartItems,
            }}>
            {children}
            <Cart isOpen={isCartOpen} close={closeCart} />
            <ProductCard
                isOpen={isProductOpen}
                close={closeProduct}
                currentProduct={currProduct}
            />
            <ConfirmationModal
                closeCart={closeCart}
                isOpen={isConfirmModalOpen}
                close={closeConfirmModal}
                message={confirmOptions.message}
                onConfirm={() => confirmOptions.onConfirm()}
            />
        </ShoppingCartContext.Provider>
    );
}
