import { createContext, useContext, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import Cart from '../components/Cart.js'
import ProductCard from '../components/ProductCard.js';
import ConfirmationModal from '../components/ConfirmationModal.js';
import storeItems from "../data/meals.json"
import meals from '../data/meals.json';

export const ShoppingCartContext = createContext();

export function useShoppingCart() {
    return useContext(ShoppingCartContext)
}

export function ShoppingCartProvider({ children }) {
    const [cartItems, setCartItems] = useLocalStorage("shopping-cart", []);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isProductOpen, setIsProductOpen] = useState(false);
    const [currProduct, setCurrentProduct] = useState([])

    const [confirmOptions, setConfirOptions] = useState({
        title: "",
        message: "",
        onConfirm: () => { }
    })

    const openProduct = (id) => { setIsProductOpen(true); setCurrentProduct(id) }
    const closeProduct = () => setIsProductOpen(false)

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    const openDelConfirmModal = (itemId) => {
        console.log(cartItems)
        setIsConfirmModalOpen(true);
        setConfirOptions({
            message: "Czy chcesz usunąć ten produkt z koszyka ?" + meals.find(el => el.id === itemId).name,
            onConfirm: () => {
                removeProductFromCart(itemId);
                closeConfirmModal();
            }
        });
    }

    const openDelAllConfirmModal = () => {
        setIsConfirmModalOpen(true);
        setConfirOptions({
            message: "Czy chcesz wszystkie produkty z koszyka?",
            onConfirm: () => {
                clearBasket()
                closeConfirmModal();
            }
        });
    }


    const closeConfirmModal = () => {
        setConfirOptions({
            message: "",
            onConfirm: () => { }
        })
        setIsConfirmModalOpen(false);
    }

    function increaseCartQuantity(id) {
        setCartItems((curr) => {
            if ((curr.find((el) => el.id === id))) { //when element with this id already exists
                return (curr.map((el) => {
                    if (el.id === id) return { ...el, quantity: el.quantity + 1 }
                    else return el
                }))
            }
            else return [...curr, { id, quantity: 1 }]
        })
    }


    function decreaseCartQuantity(id) {
        if (cartItems.find((el) => el.id === id)?.quantity === 1 /*when el.quantity is just 1*/) {
            openDelConfirmModal(id)
        }
        else {  // when el.quantity is higher then 1 
            setCartItems((curr) => {
                return curr.map((el) => {
                    if (el.id === id) return ({ id, quantity: el.quantity - 1 })
                    else return el
                })
            })
        }
    }

    function removeProductFromCart(removerItemId) {
        setCartItems((curr) => {
            const newTab = curr.filter(el => el.id !== removerItemId)
            return newTab
        })
    }

    const clearBasket = () => setCartItems([])

    const getItemQuantity = (id) => {
        const item = cartItems.find((el) => el.id === id);
        return item ? item.quantity : 0;
    }

    const cartQuantity = cartItems.reduce(
        (quantity, item) => item.quantity + quantity, 0
    )

    const cartSummaryPrice = () => {
        return ([...cartItems].reduce((accumulator, currentValue) => {
            const storeItem = storeItems.find((el) => el.id === currentValue.id)
            return (accumulator + (parseFloat(storeItem.price) * parseFloat(currentValue.quantity)))
        }, 0)
        )
    }

    return (
        <ShoppingCartContext.Provider value={{
            increaseCartQuantity,
            decreaseCartQuantity,
            clearBasket,
            cartQuantity,
            cartSummaryPrice,
            getItemQuantity,
            openCart,
            openDelConfirmModal,
            openDelAllConfirmModal,
            closeCart,
            openProduct,
            cartItems
        }}>
            {children}
            <Cart
                isOpen={isCartOpen}
                close={closeCart}
            />
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