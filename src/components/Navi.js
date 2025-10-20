import '../styles/navi.scss';

export default function Navi({ close, isOpen }) {
     return (
          <nav className={`navi ${isOpen ? '' : 'navi--hidden'}`}>
               <ul className="navi__list">
                    <li className="navi__item">
                         <a href='/' className="navi__link" onClick={() => close()}>Home</a>
                    </li>
                    <li className="navi__item">
                          <a href='#about' className="navi__link" onClick={() => close()}>About Us</a>
                    </li>
                    <li className="navi__item">
                        <a href='#our-menu' className="navi__link" onClick={() => close()}>Our Menu</a>
                    </li>
                    <li className="navi__item">
                           <a href='#specials' className="navi__link" onClick={() => close()}>Specials</a>
                    </li>
                    <li className="navi__item">
                        <a href='#events' className="navi__link" onClick={() => close()}>Events</a>
                    </li>
                     <li className="navi__item">
                        <a href='#gallery' className="navi__link" onClick={() => close()}>Gallery</a>
                    </li>
                     <li className="navi__item">
                        <a href='#contact' className="navi__link" onClick={() => close()}>Contact</a>
                    </li>
                    <li className="navi__close-button" onClick={() => close()}>
                         X
                    </li>
               </ul>
          </nav>
     );
}
