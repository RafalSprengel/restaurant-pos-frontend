import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBaseball } from '@fortawesome/free-solid-svg-icons';
import '../styles/Footer.scss';
import logoXL from '../img/logo-white-XL.png';
import { useShoppingCart } from '../context/ShoppingCartContext';

export default function Footer() {
  const { name, surname } = useShoppingCart();
  return (
    <footer className="footer">
      <div className="footer__inner-wrap">
        <div className="footer__section-1">
          <img src={logoXL} />
        </div>
        <div className="footer__section-2">
          <span> Cwiartki 3/4, Wrocław</span>
          <span>Telefon: 516 909 517</span>
          <span>E-mail: hot.food@mail.com</span>
        </div>
        <div className="footer__section-3">
          <FontAwesomeIcon icon={faBaseball} />
        </div>
      </div>
      {name + ' ' + surname}
    </footer>
  );
}
