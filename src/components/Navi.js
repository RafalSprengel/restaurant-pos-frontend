import '../styles/navi.scss';

export default function Navi({ showMobNav, toggleMobNav }) {
     return (
          <nav className={`navi ${showMobNav ? '' : 'navi--hidden'}`}>
               <ul className="navi__list">
                    <li className="navi__item">
                         <a href='/' className="navi__link" onClick={() => toggleMobNav(false)}>Home</a>
                    </li>
                    <li className="navi__item">
                          <a href='#about' className="navi__link" onClick={() => toggleMobNav(false)}>About Us</a>
                    </li>
                    <li className="navi__item">
                        <a href='#our-menu' className="navi__link" onClick={() => toggleMobNav(false)}>Our Menu</a>
                    </li>
                    <li className="navi__item">
                           <a href='#specials' className="navi__link" onClick={() => toggleMobNav(false)}>Specials</a>
                    </li>
                    <li className="navi__item">
                        <a href='#events' className="navi__link" onClick={() => toggleMobNav(false)}>Events</a>
                    </li>
                     <li className="navi__item">
                        <a href='#gallery' className="navi__link" onClick={() => toggleMobNav(false)}>Gallery</a>
                    </li>
                     <li className="navi__item">
                        <a href='#contact' className="navi__link" onClick={() => toggleMobNav(false)}>Contact</a>
                    </li>
                    <li className="navi__close-button" onClick={() => toggleMobNav(false)}>
                         X
                    </li>
               </ul>
          </nav>
     );
}
