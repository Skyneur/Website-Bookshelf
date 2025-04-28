import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaSadTear } from 'react-icons/fa';

const NotFoundPage: React.FC = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <FaSadTear className="not-found-icon" />
        <h1>404 - Page non trouvée</h1>
        <p>La page que vous recherchez n'existe pas ou a été déplacée.</p>
        <Link to="/dashboard" className="button">
          <FaHome /> Retour à l'accueil
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
