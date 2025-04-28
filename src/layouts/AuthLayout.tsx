import React from 'react';
import '../assets/styles/layouts/AuthLayout.scss';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-logo">
          <img src="/logo.png" alt="La maison du Livre" />
          <h1>La maison du Livre</h1>
          <p>Médiathèque municipale de Montpellier</p>
        </div>
        
        <div className="auth-content">
          {children}
        </div>
        
        <div className="auth-footer">
          <p>&copy; {new Date().getFullYear()} La maison du Livre - Tous droits réservés</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
