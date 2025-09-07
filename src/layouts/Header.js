import { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Navi from '../components/Navi';
import './header.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';
import { IoPersonSharp } from 'react-icons/io5';

import { IconPhone, IconMapPin } from '@tabler/icons-react';
import { useAuth } from '../context/authContext.js';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [showMobNav, setShowMobNav] = useState(false);
    const infoBarRef = useRef(null);

    const { isAuthenticated, user } = useAuth();


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
                <div className={'header__info-bar ' + (isScrolled ? 'header__info-bar--hidden' : '')}>
                    <div ref={infoBarRef} className="header__info-bar-inner">
                        <a href="tel:+48123456789" className="header__info-link">
                            <IconPhone size={18} stroke={1} style={{ color: '#cda45e' }} />
                            <p>+48 123 456 789</p>
                        </a>
                        <p className="header__info-separator">|</p>
                        <a href="https://www.google.com/maps?q=222+Holderness+Road+Hull" target="_blank" rel="noopener noreferrer" className="header__info-link">
                            <IconMapPin size={18} stroke={1} style={{ color: '#cda45e' }} />
                            <p>222 Holderness Road, Hull</p>
                        </a>
                    </div>
                </div>

                <div className={'header__nav ' + (!isScrolled ? 'header__nav--lighter-bg' : '')}>
                    <div className="header__nav-inner container">
                        <div className="header__logo-wrap">
                            <NavLink to="#" className="header__logo">
                                <FontAwesomeIcon icon={faUtensils} className="header__logo-icon" />
                                Restoran
                            </NavLink>
                        </div>
                        <Navi showMobNav={showMobNav} toggleMobNav={handleToggleMobileMenu} />
                        <div className='header__icons'>
                            <NavLink to="/customer/login" className='header__link'>
                                <span className="header__user-status">
                                    {isAuthenticated ? 'Hi, ' + user.firstName : 'Sing in'}
                                </span>
                                <span className="btn-accent-primary header__btn-login">
                                    <IoPersonSharp size={18} />
                                </span>

                            </NavLink>
                            <div className={'header__hamburger-icon ' + (showMobNav ? 'header__hamburger-icon--hidden' : '')} onClick={handleToggleMobileMenu}>
                                ☰
                            </div>
                        </div>

                    </div>
                </div>
            </header>
        </>
    );
}