import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../../store';
import { fetchEmprunts, setFilter, clearFilters } from '../../store/slices/empruntsSlice';
import { Emprunt, StatutEmprunt } from '../../types';
import { FaPlus, FaSearch, FaFilter, FaTimes, FaBook, FaUser, FaCalendarAlt } from 'react-icons/fa';

const EmpruntsListPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items, loading, error, filters } = useSelector((state: RootState) => state.emprunts);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchEmprunts());
  }, [dispatch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // La recherche serait implémentée ici
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const handleFilterChange = (filterName: string, value: any) => {
    dispatch(setFilter({ [filterName]: value }));
  };

  // Filtrage côté client (à remplacer par un filtrage serveur idéalement)
  const filteredEmprunts = items;

  return (
    <div className="emprunts-list-page">
      <div className="page-header">
        <h1>Emprunts</h1>
        <button 
          className="button accent"
          onClick={() => navigate('/emprunts/new')}
        >
          <FaPlus /> Nouvel emprunt
        </button>
      </div>

      <div className="search-filter-container">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-container">
            <input 
              type="text" 
              placeholder="Rechercher par adhérent, document..."
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
          
          {(filters.statut !== null) && (
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
              <label>Statut</label>
              <select 
                value={filters.statut || ''} 
                onChange={(e) => {
                  const value = e.target.value;
                  handleFilterChange('statut', value ? value : null);
                }}
              >
                <option value="">Tous</option>
                <option value={StatutEmprunt.EN_COURS}>En cours</option>
                <option value={StatutEmprunt.RENDU}>Rendus</option>
                <option value={StatutEmprunt.RETARD}>En retard</option>
                <option value={StatutEmprunt.PERDU}>Perdus</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="loading-indicator">Chargement des emprunts...</div>
      ) : error ? (
        <div className="error-message">Erreur: {error}</div>
      ) : (
        <>
          <div className="emprunts-count">
            <p>{filteredEmprunts.length} emprunt(s) trouvé(s)</p>
          </div>
          
          {filteredEmprunts.length === 0 ? (
            <div className="no-emprunts">
              <p>Aucun emprunt ne correspond à votre recherche.</p>
            </div>
          ) : (
            <div className="emprunts-table-container">
              <table className="emprunts-table">
                <thead>
                  <tr>
                    <th>Document</th>
                    <th>Adhérent</th>
                    <th>Date d'emprunt</th>
                    <th>Date de retour prévue</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmprunts.map(emprunt => (
                    <tr 
                      key={emprunt.id} 
                      className={`emprunt-row ${emprunt.statut === StatutEmprunt.RETARD ? 'retard' : ''}`}
                    >
                      <td className="emprunt-document">
                        <FaBook className="icon" />
                        <span>Document #{emprunt.documentId}</span>
                      </td>
                      <td className="emprunt-adherent">
                        <FaUser className="icon" />
                        <span>Adhérent #{emprunt.adherentId}</span>
                      </td>
                      <td className="emprunt-date">
                        <FaCalendarAlt className="icon" />
                        <span>{emprunt.dateEmprunt}</span>
                      </td>
                      <td className="emprunt-date-retour">
                        <span>{emprunt.dateRetourPrevue}</span>
                      </td>
                      <td className="emprunt-statut">
                        <span className={`status-badge ${emprunt.statut}`}>
                          {emprunt.statut === StatutEmprunt.EN_COURS ? 'En cours' : 
                           emprunt.statut === StatutEmprunt.RENDU ? 'Rendu' : 
                           emprunt.statut === StatutEmprunt.RETARD ? 'En retard' : 'Perdu'}
                        </span>
                      </td>
                      <td className="emprunt-actions">
                        <button className="button small">Détails</button>
                        {emprunt.statut === StatutEmprunt.EN_COURS && (
                          <button className="button small secondary">Enregistrer le retour</button>
                        )}
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

export default EmpruntsListPage;
