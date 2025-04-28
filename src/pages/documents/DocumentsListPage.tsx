import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../../store';
import { fetchDocuments, setFilter, clearFilters } from '../../store/slices/documentsSlice';
import { Document, DocumentType } from '../../types';
import { FaPlus, FaSearch, FaFilter, FaTimes } from 'react-icons/fa';

const DocumentsListPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items, loading, error, filters } = useSelector((state: RootState) => state.documents);
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm || '');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchDocuments());
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
  const filteredDocuments = items.filter(doc => {
    let matches = true;
    
    if (filters.searchTerm && filters.searchTerm.trim() !== '') {
      const term = filters.searchTerm.toLowerCase();
      matches = matches && (
        doc.titre.toLowerCase().includes(term) || 
        doc.auteur.toLowerCase().includes(term) || 
        doc.description.toLowerCase().includes(term)
      );
    }
    
    if (filters.type !== null) {
      matches = matches && doc.type === filters.type;
    }
    
    if (filters.disponible !== null) {
      matches = matches && doc.disponible === filters.disponible;
    }
    
    if (filters.categorie !== null && filters.categorie !== '') {
      matches = matches && doc.categorie === filters.categorie;
    }
    
    return matches;
  });

  // Récupérer les catégories uniques pour les filtres
  const categories = Array.from(new Set(items.map(doc => doc.categorie)));

  return (
    <div className="documents-list-page">
      <div className="page-header">
        <h1>Documents</h1>
        <button 
          className="button accent"
          onClick={() => navigate('/documents/new')}
        >
          <FaPlus /> Nouveau document
        </button>
      </div>

      <div className="search-filter-container">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-container">
            <input 
              type="text" 
              placeholder="Rechercher par titre, auteur..."
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
          
          {(filters.type !== null || filters.disponible !== null || filters.categorie !== null) && (
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
              <label>Type</label>
              <select 
                value={filters.type || ''} 
                onChange={(e) => handleFilterChange('type', e.target.value ? e.target.value : null)}
              >
                <option value="">Tous</option>
                {Object.values(DocumentType).map(type => (
                  <option key={type} value={type}>
                    {type === 'livre' ? 'Livres' : 
                     type === 'periodique' ? 'Périodiques' : 
                     type === 'audio' ? 'Documents sonores' : 
                     type === 'dvd' ? 'DVD' : 'Blu-Ray'}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Disponibilité</label>
              <select 
                value={filters.disponible === null ? '' : filters.disponible ? 'true' : 'false'} 
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '') handleFilterChange('disponible', null);
                  else handleFilterChange('disponible', value === 'true');
                }}
              >
                <option value="">Tous</option>
                <option value="true">Disponible</option>
                <option value="false">Indisponible</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Catégorie</label>
              <select 
                value={filters.categorie || ''} 
                onChange={(e) => handleFilterChange('categorie', e.target.value || null)}
              >
                <option value="">Toutes</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="loading-indicator">Chargement des documents...</div>
      ) : error ? (
        <div className="error-message">Erreur: {error}</div>
      ) : (
        <>
          <div className="documents-count">
            <p>{filteredDocuments.length} document(s) trouvé(s)</p>
          </div>
          
          {filteredDocuments.length === 0 ? (
            <div className="no-documents">
              <p>Aucun document ne correspond à votre recherche.</p>
            </div>
          ) : (
            <div className="documents-grid">
              {filteredDocuments.map(document => (
                <DocumentCard key={document.id} document={document} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Composant de carte pour un document
const DocumentCard: React.FC<{ document: Document }> = ({ document }) => {
  return (
    <Link to={`/documents/${document.id}`} className="document-card">
      <div className="document-image">
        <img 
          src={document.image || '/placeholder-book.png'} 
          alt={document.titre} 
        />
        <div className={`document-status ${document.disponible ? 'disponible' : 'emprunte'}`}>
          {document.disponible ? 'Disponible' : 'Emprunté'}
        </div>
      </div>
      <div className="document-info">
        <h3 className="document-title">{document.titre}</h3>
        <p className="document-author">{document.auteur}</p>
        <p className="document-type">{document.type.toUpperCase()} - {document.categorie}</p>
        <p className="document-year">{document.anneePublication}</p>
      </div>
    </Link>
  );
};

export default DocumentsListPage;
