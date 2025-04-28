import React from 'react';
import '../../assets/styles/components/layout/Footer.scss';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div>
          <p>&copy; {currentYear} La maison du Livre - Médiathèque municipale de Montpellier</p>
        </div>
        <div className="footer-links">
          <a href="#">Politique de confidentialité</a>
          <span className="separator">|</span>
          <a href="#">Conditions d'utilisation</a>
          <span className="separator">|</span>
          <a href="#">Support</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
