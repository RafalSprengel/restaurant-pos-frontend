import { NavLink } from "react-router-dom";
import '../styles/Navi.scss';

export default function Navi({ isVisibleMobileNavi, handleIsVisibleMobile }) {
    const closeMobileMenu = () => {
        handleIsVisibleMobile(false); // Ustawiamy isVisibleMobileNavi na false po kliknięciu
    };

    return (
        <nav className={`navi ${isVisibleMobileNavi && "navi__show"}`}>
            <li className="navi__close-button" onClick={() => handleIsVisibleMobile()}>X</li>
            <ul>
                <NavLink to='/' onClick={closeMobileMenu}><li>START</li></NavLink>
                <NavLink to='/o-nas' onClick={closeMobileMenu}><li>O NAS</li></NavLink>
                <NavLink to='menu' onClick={closeMobileMenu}><li>MENU</li></NavLink>
                <NavLink to='promocje' onClick={closeMobileMenu}><li>PROMOCJE</li></NavLink>
                <NavLink to='imprezy' onClick={closeMobileMenu}><li>IMPREZY</li></NavLink>
                <NavLink to='kontakt' onClick={closeMobileMenu}><li>KONTAKT</li></NavLink>
            </ul>
        </nav>
    )
}