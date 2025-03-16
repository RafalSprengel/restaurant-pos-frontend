import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useShoppingCart } from '../context/ShoppingCartContext';
import Navi from '../components/Navi';
import logoImg from '../img/logo-white-XL.png';
import '../styles/Header.scss';

export default function Header() {
    const [isSticky, setIsSticky] = useState(false);
    const [isVisibleMobileNavi, setIsVisibleMobileNavi] = useState(false);
    const { cartQuantity, openCart } = useShoppingCart();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 90);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleIsVisibleMobile = () => {
        document.querySelector('body').style.overflow = isVisibleMobileNavi ? 'visible' : 'hidden';
        setIsVisibleMobileNavi(!isVisibleMobileNavi);
    };

    return (
        <header className={'header ' + (isSticky ? 'sticky' : '')}>
            <div className="header__inner-wrap" alt="Hot Food" title="Hot Food">
                <div className="header__logo">
                    <NavLink to="">
                        <img src={logoImg} alt="" />
                    </NavLink>
                </div>
                <Navi isVisibleMobileNavi={isVisibleMobileNavi} handleIsVisibleMobile={handleIsVisibleMobile} />
                <div className='header__login-icon-wrap'>
                    <div className="header__cart-wrap" onClick={() => openCart()}>
                        <div className="header__cart-wrap__inner" alt="Cart" title="Cart">
                            <span className="material-symbols-outlined header__cart-wrap__inner__cart">shopping_cart</span>
                            <span className="header__cart-wrap__inner__number">{cartQuantity}</span>
                        </div>
                    </div>
                    <div
                        className="header__login-icon-wrap"
                        alt="Login"
                        title="Login"
                        onClick={() => navigate('/customer/login')}>
                        <div className="material-symbols-outlined header__login-icon">person</div>
                    </div>
                    <div className="header__mobile-nav-icon" onClick={handleIsVisibleMobile}>
                        ☰
                    </div>
                </div>
               
            </div>
        </header>
    );
}
