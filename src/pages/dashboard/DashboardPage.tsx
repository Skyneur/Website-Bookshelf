import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchDocuments } from '../../store/slices/documentsSlice';
import { fetchAdherents } from '../../store/slices/adherentsSlice';
import { fetchEmprunts } from '../../store/slices/empruntsSlice';
import { StatutEmprunt } from '../../types';
import { FaBook, FaUsers, FaExchangeAlt, FaExclamationTriangle } from 'react-icons/fa';

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: documents, loading: docsLoading } = useSelector((state: RootState) => state.documents);
  const { items: adherents, loading: adherentsLoading } = useSelector((state: RootState) => state.adherents);
  const { items: emprunts, loading: empruntsLoading } = useSelector((state: RootState) => state.emprunts);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchDocuments());
    dispatch(fetchAdherents());
    dispatch(fetchEmprunts());
  }, [dispatch]);

  // Compteurs pour le dashboard
  const documentsCount = documents.length;
  const documentsDisponibles = documents.filter(doc => doc.disponible).length;
  const adherentsCount = adherents.length;
  const adherentsActifs = adherents.filter(ad => ad.abonnementActif).length;
  const empruntsEnCours = emprunts.filter(emp => emp.statut === StatutEmprunt.EN_COURS).length;
  const empruntsEnRetard = emprunts.filter(emp => emp.statut === StatutEmprunt.RETARD).length;

  const isLoading = docsLoading || adherentsLoading || empruntsLoading;

  return (
    <div className="dashboard-page">
      <h1>Tableau de bord</h1>
      <p className="welcome-message">Bienvenue, {user?.prenom} {user?.nom}</p>

      {isLoading ? (
        <div className="loading-indicator">Chargement des données...</div>
      ) : (
        <div className="dashboard-content">
          <div className="dashboard-cards">
            <div className="dashboard-card documents">
              <div className="card-icon">
                <FaBook />
              </div>
              <div className="card-content">
                <h3>Documents</h3>
                <p className="card-count">{documentsCount}</p>
                <p className="card-subtext">{documentsDisponibles} disponibles</p>
              </div>
            </div>

            <div className="dashboard-card adherents">
              <div className="card-icon">
                <FaUsers />
              </div>
              <div className="card-content">
                <h3>Adhérents</h3>
                <p className="card-count">{adherentsCount}</p>
                <p className="card-subtext">{adherentsActifs} abonnements actifs</p>
              </div>
            </div>

            <div className="dashboard-card emprunts">
              <div className="card-icon">
                <FaExchangeAlt />
              </div>
              <div className="card-content">
                <h3>Emprunts</h3>
                <p className="card-count">{empruntsEnCours}</p>
                <p className="card-subtext">en cours</p>
              </div>
            </div>

            <div className="dashboard-card retards">
              <div className="card-icon">
                <FaExclamationTriangle />
              </div>
              <div className="card-content">
                <h3>Retards</h3>
                <p className="card-count">{empruntsEnRetard}</p>
                <p className="card-subtext">à traiter</p>
              </div>
            </div>
          </div>

          <div className="dashboard-sections">
            <div className="dashboard-section">
              <h2>Activité récente</h2>
              <p>Les données d'activité récente seront affichées ici.</p>
              {/* Tableau d'activités récentes */}
            </div>

            <div className="dashboard-section">
              <h2>Emprunts en retard</h2>
              {empruntsEnRetard > 0 ? (
                <p>Liste des emprunts en retard à implémenter</p>
                // Table des emprunts en retard
              ) : (
                <p className="no-data">Aucun emprunt en retard.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
