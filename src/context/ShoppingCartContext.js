import { createContext, useContext, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import Cart from '../components/Cart'
import ProductCard from '../components/ProductCard.js';
import storeItems from "../data/meals.json"

export const ShoppingCartContext = createContext();

export function useShoppingCart() {
    return useContext(ShoppingCartContext)
}

export function ShoppingCartProvider({ children }) {
    const [cartItems, setCartItems] = useLocalStorage("shopping-cart", []);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isProductOpen, setIsProductOpen] = useState(false);
    const [currProduct, setCurrentProduct] = useState([])

    const showProduct = (id) => { setIsProductOpen(true); setCurrentProduct(id) }
    const closeProduct = () => setIsProductOpen(false)

    const showCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    function increaseCartQuantity(id) {
        setCartItems((curr) => {
            if ((curr.find((el) => el.id === id))) { //w w przypadku gdy już będzie element o danym id
                return (curr.map((el) => {
                    if (el.id === id) return { ...el, quantity: el.quantity + 1 }
                    else return el
                }))
            }
            else return [...curr, { id, quantity: 1 }]
        })
    }

    function decreaseCartQuantity(id) {
        setCartItems((curr) => {
            if (curr.find((el) => el.id === id)?.quantity === 1) return curr.filter((el) => el.id !== id) //when el.quantity is just 1
            else {  // when el.quantity is higher then 1 
                return curr.map((el) => {
                    if (el.id === id) return ({ id, quantity: el.quantity - 1 })
                    else return el
                })
            }
        })
    }

    function clearBasket() {
        setCartItems([])
    }

    const getItemQuantity = (id) => {
        let res = cartItems.find((el) => el.id === id) ? cartItems.find((el) => el.id === id)?.quantity : 0;
        return res
    }

    const cartQuantity = cartItems.reduce(
        (quantity, item) => item.quantity + quantity,
        0
    )

    const cartSummaryPrice = () => {
        return ([...cartItems].reduce((accumulator, currentValue) => {
            const storeItem = storeItems.find((el) => el.id === currentValue.id)
            return (accumulator + (parseFloat(storeItem.price) * parseFloat(currentValue.quantity)))
        }, 0)
        )
    }

    // let allItems = [...cartItems];

    // allItems = allItems.reduce((accumulator, currentValue) => {
    //     const storeItem = storeItems.find((el) => el.id === currentValue.id)

    //     return (accumulator + (parseFloat(storeItem.price) * parseFloat(currentValue.quantity)))
    // }, 0)


    return (
        <ShoppingCartContext.Provider value={{
            increaseCartQuantity,
            decreaseCartQuantity,
            clearBasket,
            cartQuantity,
            cartSummaryPrice,
            getItemQuantity,
            showCart,
            closeCart,
            showProduct,
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
        </ShoppingCartContext.Provider>
    )
}