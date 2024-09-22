import { NavLink } from "react-router-dom";
import '../styles/Navi.scss';

export default function Navi({ isVisibleMobileNavi, handleIsVisibleMobile }) {
    const closeMobileMenu = () => {
        if (isVisibleMobileNavi) handleIsVisibleMobile(false);
    }

    return (
        <nav className={`navi ${isVisibleMobileNavi && "navi__show"}`}>
            <li className="navi__close-button" onClick={() => handleIsVisibleMobile(false)}>X</li>
            <ul>
                <NavLink to='/' onClick={closeMobileMenu}><li>HOME</li></NavLink>
                <NavLink to='/about-us' onClick={closeMobileMenu}><li>ABOUT US</li></NavLink>
                <NavLink to='/menu' onClick={closeMobileMenu}><li>MENU</li></NavLink>
                <NavLink to='/promotions' onClick={closeMobileMenu}><li>PROMOTIONS</li></NavLink>
                <NavLink to='/events' onClick={closeMobileMenu}><li>EVENTS</li></NavLink>
                <NavLink to='/contact' onClick={closeMobileMenu}><li>CONTACT</li></NavLink>
            </ul>
        </nav>
    );
}
