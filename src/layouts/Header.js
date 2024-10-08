import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Navi from '../components/Navi';
import logoImg from '../img/logo-white-XL.png';
import '../styles/Header.scss';
import { useShoppingCart } from '../context/ShoppingCartContext';

export default function Header() {
  const [isSticky, setIsSticky] = useState(false);
  const [isVisibleMobileNavi, setIsVisibleMobileNavi] = useState(false);
  const { cartQuantity, openCart } = useShoppingCart();

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
      <div className="header__inner-wrap">
        <div className="header__logo">
          <NavLink to="">
            <img src={logoImg} alt="" />
          </NavLink>
        </div>
        <Navi isVisibleMobileNavi={isVisibleMobileNavi} handleIsVisibleMobile={handleIsVisibleMobile} />
        <div className="header__cart-wrap" onClick={() => openCart()}>
          <div className="header__cart-wrap__inner">
            <span className="material-symbols-outlined header__cart-wrap__inner__cart">shopping_cart</span>
            <span className="header__cart-wrap__inner__number">{cartQuantity}</span>
          </div>
        </div>
        <div className="header__mobile-nav-icon" onClick={handleIsVisibleMobile}>
          ☰
        </div>
      </div>
    </header>
  );
}
