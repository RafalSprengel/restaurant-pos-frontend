import { NavLink } from 'react-router-dom';
import '../styles/Navi.scss';

export default function Navi({ showMobNav, toggleMobNav }) {
     return (
          <nav className={`navi ${showMobNav ? '' : 'navi--hidden'}`}>
               <ul className="navi__list">
                    <li className="navi__item">
                         <NavLink to="/" className="navi__link" onClick={() => toggleMobNav(false)}>
                              Home
                         </NavLink>
                    </li>
                    <li className="navi__item">
                         <NavLink to="/about-us" className="navi__link" onClick={() => toggleMobNav(false)}>
                              About
                         </NavLink>
                    </li>
                    <li className="navi__item">
                         <NavLink to="/menu" className="navi__link" onClick={() => toggleMobNav(false)}>
                              Menu
                         </NavLink>
                    </li>
                    <li className="navi__item">
                         <NavLink to="/promotions" className="navi__link" onClick={() => toggleMobNav(false)}>
                              Promotions
                         </NavLink>
                    </li>
                    <li className="navi__item">
                         <NavLink to="/events" className="navi__link" onClick={() => toggleMobNav(false)}>
                              Events
                         </NavLink>
                    </li>
                    <li className="navi__item">
                         <NavLink to="/contact" className="navi__link" onClick={() => toggleMobNav(false)}>
                              Contact
                         </NavLink>
                    </li>
                    <li className="navi__close-button" onClick={() => toggleMobNav(false)}>
                         X
                    </li>
               </ul>
          </nav>
     );
}
