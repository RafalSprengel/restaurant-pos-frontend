import { createContext, useContext, useState } from 'react';
import { useLocalStorageWithValidation } from '../hooks/useLocalStorageWithValidation.js';
import Cart from '../components/Cart.js';
import ProductCard from '../components/ProductCard.js';

export const ShoppingCartContext = createContext();

export function useShoppingCart() {
    return useContext(ShoppingCartContext);
}

export function ShoppingCartProvider({ children }) {
    const [cartItems, setCartItems] = useLocalStorageWithValidation('shopping-cart', []);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isProductOpen, setIsProductOpen] = useState(false);
    const [currProduct, setCurrentProduct] = useState([]);

    const openProduct = (id) => {
        setIsProductOpen(true);
        setCurrentProduct(id);
    };
    const closeProduct = () => setIsProductOpen(false);
    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    function increaseCartQuantity(product) {
        setCartItems((curr) => {
            if (curr.find((el) => el._id === product._id)) {
                return curr.map((el) => {
                    if (el._id === product._id) return { ...el, quantity: el.quantity + 1 };
                    else return el;
                });
            } else return [...curr, { ...product, quantity: 1 }];
        });
    }

    function decreaseCartQuantity(product) {
        if (cartItems.find((el) => el._id === product._id)?.quantity === 1) {
        } else {
            setCartItems((curr) => {
                return curr.map((el) => {
                    if (el._id === product._id) return { ...el, quantity: el.quantity - 1 };
                    else return el;
                });
            });
        }
    }

    function removeProductFromCart(removedItemId) {
        setCartItems((curr) => {
            return curr.filter((el) => el._id !== removedItemId);
        });
    }

    const clearCart = () => setCartItems([]);

    const getItemQuantity = (id) => {
        const item = cartItems.find((el) => el._id === id);
        return item ? item.quantity : 0;
    };

    const cartQuantity = cartItems.reduce((quantity, item) => item.quantity + quantity, 0);

    const cartSummaryPrice = () => {
        return cartItems.reduce((accumulator, currentValue) => {
            const storeItem = cartItems.find((el) => el._id === currentValue._id);
            return accumulator + parseFloat(storeItem.price) * parseFloat(currentValue.quantity);
        }, 0);
    };

    return (
        <ShoppingCartContext.Provider
            value={{
                increaseCartQuantity,
                decreaseCartQuantity,
                removeProductFromCart, 
                clearCart,
                cartQuantity,
                cartSummaryPrice,
                getItemQuantity,
                openCart,
                isCartOpen,
                closeCart,
                openProduct,
                cartItems,
            }}>
            {children}
            <Cart isOpen={isCartOpen} close={closeCart} />
            <ProductCard isOpen={isProductOpen} close={closeProduct} currentProduct={currProduct} />
        </ShoppingCartContext.Provider>
    );
}