import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../../store';
import { fetchAdherents, setFilter, clearFilters } from '../../store/slices/adherentsSlice';
import { Adherent, TypeAbonnement } from '../../types';
import { FaPlus, FaSearch, FaFilter, FaTimes, FaUserCircle } from 'react-icons/fa';

const AdherentsListPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items, loading, error, filters } = useSelector((state: RootState) => state.adherents);
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm || '');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchAdherents());
  }, [dispatch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setFilter({ searchTerm }));
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    dispatch(clearFilters());
  };

  const handleFilterChange = (filterName: string, value: any) => {
    dispatch(setFilter({ [filterName]: value }));
  };

  // Filtrage côté client (à remplacer par un filtrage serveur idéalement)
  const filteredAdherents = items.filter(adherent => {
    let matches = true;
    
    if (filters.searchTerm && filters.searchTerm.trim() !== '') {
      const term = filters.searchTerm.toLowerCase();
      matches = matches && (
        adherent.nom.toLowerCase().includes(term) || 
        adherent.prenom.toLowerCase().includes(term) || 
        adherent.email.toLowerCase().includes(term) ||
        adherent.telephone.includes(term)
      );
    }
    
    if (filters.abonnementActif !== null) {
      matches = matches && adherent.abonnementActif === filters.abonnementActif;
    }
    
    return matches;
  });

  return (
    <div className="adherents-list-page">
      <div className="page-header">
        <h1>Adhérents</h1>
        <button 
          className="button accent"
          onClick={() => navigate('/adherents/new')}
        >
          <FaPlus /> Nouvel adhérent
        </button>
      </div>

      <div className="search-filter-container">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-container">
            <input 
              type="text" 
              placeholder="Rechercher par nom, prénom, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">
              <FaSearch /> Rechercher
            </button>
          </div>
          
          <button 
            type="button" 
            className="filter-toggle-button"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter /> Filtres
          </button>
          
          {filters.abonnementActif !== null && (
            <button 
              type="button" 
              className="clear-filters-button"
              onClick={handleClearFilters}
            >
              <FaTimes /> Effacer les filtres
            </button>
          )}
        </form>
        
        {showFilters && (
          <div className="filters-panel">
            <div className="filter-group">
              <label>Statut abonnement</label>
              <select 
                value={filters.abonnementActif === null ? '' : filters.abonnementActif ? 'true' : 'false'} 
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '') handleFilterChange('abonnementActif', null);
                  else handleFilterChange('abonnementActif', value === 'true');
                }}
              >
                <option value="">Tous</option>
                <option value="true">Abonnement actif</option>
                <option value="false">Abonnement expiré</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="loading-indicator">Chargement des adhérents...</div>
      ) : error ? (
        <div className="error-message">Erreur: {error}</div>
      ) : (
        <>
          <div className="adherents-count">
            <p>{filteredAdherents.length} adhérent(s) trouvé(s)</p>
          </div>
          
          {filteredAdherents.length === 0 ? (
            <div className="no-adherents">
              <p>Aucun adhérent ne correspond à votre recherche.</p>
            </div>
          ) : (
            <div className="adherents-table-container">
              <table className="adherents-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Nom</th>
                    <th>Contact</th>
                    <th>Abonnement</th>
                    <th>Emprunts</th>
                    <th>Inscription</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdherents.map(adherent => (
                    <tr key={adherent.id} className={adherent.abonnementActif ? '' : 'inactive'}>
                      <td className="adherent-avatar">
                        <FaUserCircle />
                      </td>
                      <td className="adherent-name">
                        <Link to={`/adherents/${adherent.id}`}>
                          <strong>{adherent.nom.toUpperCase()}</strong>, {adherent.prenom}
                        </Link>
                      </td>
                      <td className="adherent-contact">
                        <div>{adherent.email}</div>
                        <div>{adherent.telephone}</div>
                      </td>
                      <td className="adherent-subscription">
                        <span className={`status-badge ${adherent.abonnementActif ? 'active' : 'inactive'}`}>
                          {adherent.abonnementActif ? 'Actif' : 'Inactif'}
                        </span>
                        {adherent.typeAbonnement && (
                          <div className="subscription-type">
                            {adherent.typeAbonnement === TypeAbonnement.GRATUIT ? 'Gratuit' : 
                             adherent.typeAbonnement === TypeAbonnement.MENSUEL ? 'Mensuel' : 'Annuel'}
                          </div>
                        )}
                        {adherent.dateFinAbonnement && adherent.abonnementActif && (
                          <div className="expiration-date">
                            Exp: {adherent.dateFinAbonnement}
                          </div>
                        )}
                      </td>
                      <td className="adherent-loans">
                        {adherent.documentsEmpruntes.length} emprunt(s)
                      </td>
                      <td className="adherent-registration">
                        {adherent.dateInscription}
                      </td>
                      <td className="adherent-actions">
                        <Link to={`/adherents/${adherent.id}`} className="button small">
                          Détails
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdherentsListPage;
