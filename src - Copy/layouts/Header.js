import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useShoppingCart } from '../context/ShoppingCartContext';
import Navi from '../components/Navi';
import '../styles/header.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';

export default function Header() {
     const [isScrolled, setIsScrolled] = useState(false);
     const [showMobNav, setShowMobNav] = useState(false);
     const { cartQuantity, openCart } = useShoppingCart();
     const infoBarRef = useRef(null);
     const navigate = useNavigate();

     const handleToggleMobileMenu = () => {
          document.querySelector('body').style.overflow = showMobNav ? 'visible' : 'hidden';
          setShowMobNav(!showMobNav);
     };

     useEffect(() => {
          const handleScroll = () => setIsScrolled(window.scrollY > 3);
          window.addEventListener('scroll', handleScroll);
          return () => window.removeEventListener('scroll', handleScroll);
     }, [isScrolled]);

     return (
          <>
               <header className="header">
                    <div className={'header__info-bar-outer ' + (isScrolled ? 'header__info-bar-outer--hidden' : '')}>
                         <div ref={infoBarRef} className="header__info-bar-inner">
                              <a href="#">📞 +48 123 456 789 | 📍 Adres Restauracji</a>
                         </div>
                    </div>

                    <div className={'header__nav-outer ' + (!isScrolled ? 'header__nav-outer--lighter-bg' : '')}>
                         <div className="header__nav-inner container">
                              <div>
                                   <NavLink to="#" className="header__logo">
                                        <FontAwesomeIcon icon={faUtensils} className="header__icon" />
                                        Restoran
                                   </NavLink>
                              </div>
                              <Navi showMobNav={showMobNav} toggleMobNav={handleToggleMobileMenu} />
                              <NavLink to="#booka-a-table" className="btn-accent-primary header__btn-book-a-table">
                                   BOOK A TABLE
                              </NavLink>
                              <div className={'header__hamburger-icon ' + (showMobNav ? 'header__ico-habmurger--hidden' : '')} onClick={handleToggleMobileMenu}>
                                   ☰
                              </div>
                         </div>

                         {/* <Navi showMobNav={showMobNav} handleToggleMobileMenu={handleToggleMobileMenu} /> */}
                         {/* <div className='header__login-icon-wrap'>
                    <div className="header__cart-wrap" onClick={() => openCart()}>
                        <div className="header__cart-wrap__inner" alt="Cart" title="Cart">
                            <span className="material-symbols-outlined header__cart-wrap__inner__cart">shopping_cart</span>
                            { cartQuantity> 0 && 
                                <span className="header__cart-wrap__inner__number">{cartQuantity}</span>
                            }
                            
                        </div>
                    </div>
                    <div
                        className="header__login-icon-wrap"
                        alt="Login"
                        title="Login"
                        onClick={() => navigate('/customer/login')}>
                        <div className="material-symbols-outlined header__login-icon">person</div>
                    </div>
                    <div className="header__mobile-nav-icon" onClick={handleToggleMobileMenu}>
                        ☰
                    </div>
                </div> */}
                    </div>
               </header>
          </>
     );
}
