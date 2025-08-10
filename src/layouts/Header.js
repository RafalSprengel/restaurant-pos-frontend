import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useShoppingCart } from '../context/ShoppingCartContext';
import Navi from '../components/Navi';
import '../styles/header.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';
import { IoPersonSharp } from 'react-icons/io5';

import { IconPhone, IconMail, IconMapPin } from '@tabler/icons-react';
import { useAuth } from '../context/authContext.js';

export default function Header() {
     const [isScrolled, setIsScrolled] = useState(false);
     const [showMobNav, setShowMobNav] = useState(false);
     const { cartQuantity, openCart } = useShoppingCart();
     const infoBarRef = useRef(null);
     const navigate = useNavigate();

     const { isAuthenticated, user, login } = useAuth();


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
                              <a href="tel:+48123456789">
                                   <IconMail size={18} stroke={1} style={{ color: '#cda45e', fontSize: '6px' }} />
                                   <p>+48 123 456 789</p>
                              </a>
                              <p>|</p>
                              <a href="https://www.google.com/maps?q=222+Holderness+Road+Hull" target="_blank" rel="noopener noreferrer">
                                   <IconPhone size={18} stroke={1} style={{ color: '#cda45e', fontSize: '12px' }} />
                                   <p>222 Holderness Road, Hull</p>
                              </a>
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
                              <div className='header__icons'>
                                   <NavLink to="/customer/login" className="btn-accent-primary header__btn-login" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        {isAuthenticated ? 'Hi, ' + user.firstName : 'Login'}<IoPersonSharp size={18} />
                                   </NavLink>
                                   <div className={'header__hamburger-icon ' + (showMobNav ? 'header__ico-habmurger--hidden' : '')} onClick={handleToggleMobileMenu}>
                                        ☰
                                   </div>
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
