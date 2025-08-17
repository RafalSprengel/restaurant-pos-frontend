import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBaseball } from '@fortawesome/free-solid-svg-icons';
import '../styles/footer.scss';
import logoXL from '../img/logo-white-XL.png';
import { Link } from 'react-router-dom';
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__content">
        <p className="footer__text">Created by <strong>Rafał Sprengel</strong></p>
        <p className="footer__contact">
          <a href="mailto:rafal.sprengel@gmail.com">rafal.sprengel@gmail.com</a> |
          <a href="tel:+48516909517">+48 516 909 517</a> |
          <a href="tel:+447518577503">+44 7518 577503</a> |
          <Link to="/management/login">Admin login</Link>
        </p>
      </div>
    </footer>

  );
}
