import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { RootState, AppDispatch } from '../../store';
import { setSelectedAdherent } from '../../store/slices/adherentsSlice';
import { Adherent, TypeAbonnement, StatutEmprunt } from '../../types';
import { FaArrowLeft, FaSave, FaTrash, FaUserCircle, FaIdCard, FaBook, FaExclamationTriangle } from 'react-icons/fa';
import { addNotification } from '../../store/slices/uiSlice';

interface AdherentDetailPageProps {
  isNew?: boolean;
}

const AdherentDetailPage: React.FC<AdherentDetailPageProps> = ({ isNew = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedAdherent, loading, error } = useSelector((state: RootState) => state.adherents);
  const [isEditing, setIsEditing] = useState(isNew);
  const [activeTab, setActiveTab] = useState('info');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    // Si c'est un nouvel adhérent, initialiser un objet vide
    // Sinon, récupérer l'adhérent par son ID (simulation)
    if (isNew) {
      dispatch(setSelectedAdherent(null));
    } else if (id) {
      // Simuler un appel API pour récupérer les détails de l'adhérent
      const mockAdherent: Adherent = {
        id,
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'jean.dupont@exemple.com',
        telephone: '0612345678',
        adresse: '123 rue de la Liberté',
        dateNaissance: '1985-05-15',
        dateInscription: '2023-01-10',
        abonnementActif: true,
        typeAbonnement: TypeAbonnement.ANNUEL,
        dateFinAbonnement: '2024-01-10',
        documentsEmpruntes: [
          {
            id: 'emp1',
            documentId: 'doc1',
            adherentId: id,
            dateEmprunt: '2023-12-01',
            dateRetourPrevue: '2023-12-22',
            prolonge: false,
            statut: StatutEmprunt.EN_COURS
          }
        ],
        amendes: []
      };
      
      setTimeout(() => {
        dispatch(setSelectedAdherent(mockAdherent));
      }, 500);
    }

    // Nettoyer la sélection lors du démontage du composant
    return () => {
      dispatch(setSelectedAdherent(null));
    };
  }, [dispatch, id, isNew]);

  const initialValues: Partial<Adherent> = selectedAdherent || {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    dateNaissance: '',
    dateInscription: new Date().toISOString().split('T')[0],
    abonnementActif: true,
    typeAbonnement: TypeAbonnement.GRATUIT,
    documentsEmpruntes: [],
    amendes: []
  };

  const validationSchema = Yup.object({
    nom: Yup.string().required('Le nom est obligatoire'),
    prenom: Yup.string().required('Le prénom est obligatoire'),
    email: Yup.string().email('Email invalide').required('L\'email est obligatoire'),
    telephone: Yup.string().required('Le téléphone est obligatoire'),
    adresse: Yup.string().required('L\'adresse est obligatoire'),
    dateNaissance: Yup.date()
      .required('La date de naissance est obligatoire')
      .max(new Date(), 'La date de naissance ne peut pas être dans le futur'),
    dateInscription: Yup.date().required('La date d\'inscription est obligatoire'),
    typeAbonnement: Yup.string().required('Le type d\'abonnement est obligatoire'),
  });

  const handleSubmit = (values: Partial<Adherent>) => {
    // Simulation de l'enregistrement de l'adhérent
    console.log('Adherent soumis:', values);
    
    dispatch(addNotification({
      message: isNew 
        ? 'L\'adhérent a été créé avec succès.' 
        : 'Les modifications ont été enregistrées.',
      type: 'success'
    }));
    
    // Rediriger vers la liste des adhérents
    setTimeout(() => {
      navigate('/adherents');
    }, 1500);
  };

  const handleDelete = () => {
    // Simulation de la suppression
    console.log(`Suppression de l'adhérent ${id}`);
    
    dispatch(addNotification({
      message: 'L\'adhérent a été supprimé.',
      type: 'success'
    }));
    
    // Rediriger vers la liste des adhérents
    navigate('/adherents');
  };

  if (loading || (!selectedAdherent && !isNew)) {
    return <div className="loading-indicator">Chargement de l'adhérent...</div>;
  }

  if (error && !isNew) {
    return <div className="error-message">Erreur: {error}</div>;
  }

  return (
    <div className="adherent-detail-page">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate('/adherents')}>
          <FaArrowLeft /> Retour à la liste
        </button>
        <h1>{isNew ? 'Nouvel adhérent' : isEditing ? 'Modifier l\'adhérent' : `${initialValues.prenom} ${initialValues.nom}`}</h1>
        
        {!isNew && !isEditing && (
          <div className="action-buttons">
            <button className="button" onClick={() => setIsEditing(true)}>Modifier</button>
            <button className="button secondary" onClick={() => setDeleteConfirmOpen(true)}>Supprimer</button>
          </div>
        )}
      </div>

      {isEditing ? (
        <Formik
          initialValues={initialValues as Adherent}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form className="adherent-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="nom">Nom</label>
                  <Field name="nom" id="nom" type="text" />
                  <ErrorMessage name="nom" component="div" className="error-message" />
                </div>

                <div className="form-group">
                  <label htmlFor="prenom">Prénom</label>
                  <Field name="prenom" id="prenom" type="text" />
                  <ErrorMessage name="prenom" component="div" className="error-message" />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <Field name="email" id="email" type="email" />
                  <ErrorMessage name="email" component="div" className="error-message" />
                </div>

                <div className="form-group">
                  <label htmlFor="telephone">Téléphone</label>
                  <Field name="telephone" id="telephone" type="text" />
                  <ErrorMessage name="telephone" component="div" className="error-message" />
                </div>

                <div className="form-group">
                  <label htmlFor="dateNaissance">Date de naissance</label>
                  <Field name="dateNaissance" id="dateNaissance" type="date" />
                  <ErrorMessage name="dateNaissance" component="div" className="error-message" />
                </div>

                <div className="form-group">
                  <label htmlFor="dateInscription">Date d'inscription</label>
                  <Field name="dateInscription" id="dateInscription" type="date" />
                  <ErrorMessage name="dateInscription" component="div" className="error-message" />
                </div>

                <div className="form-group">
                  <label htmlFor="typeAbonnement">Type d'abonnement</label>
                  <Field as="select" name="typeAbonnement" id="typeAbonnement">
                    <option value={TypeAbonnement.GRATUIT}>Gratuit (résident / étudiant)</option>
                    <option value={TypeAbonnement.MENSUEL}>Mensuel (10,50€/mois)</option>
                    <option value={TypeAbonnement.ANNUEL}>Annuel (22€/an)</option>
                  </Field>
                  <ErrorMessage name="typeAbonnement" component="div" className="error-message" />
                </div>

                <div className="form-group checkbox-group">
                  <label>
                    <Field name="abonnementActif" type="checkbox" />
                    Abonnement actif
                  </label>
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="adresse">Adresse complète</label>
                <Field as="textarea" name="adresse" id="adresse" rows="3" />
                <ErrorMessage name="adresse" component="div" className="error-message" />
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="button secondary"
                  onClick={() => {
                    if (isNew) navigate('/adherents');
                    else setIsEditing(false);
                  }}
                >
                  Annuler
                </button>
                <button type="submit" className="button" disabled={isSubmitting}>
                  <FaSave /> {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      ) : (
        <div className="adherent-details">
          {selectedAdherent && (
            <>
              <div className="adherent-header">
                <div className="adherent-avatar">
                  <FaUserCircle />
                </div>
                <div className="adherent-header-info">
                  <h2>{selectedAdherent.prenom} {selectedAdherent.nom}</h2>
                  <p className="adherent-contact">{selectedAdherent.email} | {selectedAdherent.telephone}</p>
                  <p className={`adherent-status ${selectedAdherent.abonnementActif ? 'active' : 'inactive'}`}>
                    {selectedAdherent.abonnementActif ? 'Abonnement actif' : 'Abonnement inactif'}
                    {selectedAdherent.typeAbonnement && (
                      <span className="subscription-type">
                        {' - '}
                        {selectedAdherent.typeAbonnement === TypeAbonnement.GRATUIT ? 'Gratuit' : 
                         selectedAdherent.typeAbonnement === TypeAbonnement.MENSUEL ? 'Mensuel' : 'Annuel'}
                      </span>
                    )}
                  </p>
                </div>
              </div>
              
              <div className="adherent-tabs">
                <button 
                  className={`tab-button ${activeTab === 'info' ? 'active' : ''}`}
                  onClick={() => setActiveTab('info')}
                >
                  <FaIdCard /> Informations
                </button>
                <button 
                  className={`tab-button ${activeTab === 'emprunts' ? 'active' : ''}`}
                  onClick={() => setActiveTab('emprunts')}
                >
                  <FaBook /> Emprunts
                  {selectedAdherent.documentsEmpruntes.length > 0 && (
                    <span className="badge">{selectedAdherent.documentsEmpruntes.length}</span>
                  )}
                </button>
                <button 
                  className={`tab-button ${activeTab === 'amendes' ? 'active' : ''}`}
                  onClick={() => setActiveTab('amendes')}
                >
                  <FaExclamationTriangle /> Amendes
                  {selectedAdherent.amendes.length > 0 && (
                    <span className="badge">{selectedAdherent.amendes.length}</span>
                  )}
                </button>
              </div>
              
              <div className="adherent-tab-content">
                {activeTab === 'info' && (
                  <div className="adherent-info-tab">
                    <div className="info-section">
                      <h3>Informations personnelles</h3>
                      <div className="info-grid">
                        <div className="info-item">
                          <span className="label">Nom complet:</span>
                          <span className="value">{selectedAdherent.prenom} {selectedAdherent.nom}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Date de naissance:</span>
                          <span className="value">{selectedAdherent.dateNaissance}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Email:</span>
                          <span className="value">{selectedAdherent.email}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Téléphone:</span>
                          <span className="value">{selectedAdherent.telephone}</span>
                        </div>
                        <div className="info-item full-width">
                          <span className="label">Adresse:</span>
                          <span className="value">{selectedAdherent.adresse}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="info-section">
                      <h3>Informations d'adhésion</h3>
                      <div className="info-grid">
                        <div className="info-item">
                          <span className="label">Date d'inscription:</span>
                          <span className="value">{selectedAdherent.dateInscription}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Type d'abonnement:</span>
                          <span className="value">
                            {selectedAdherent.typeAbonnement === TypeAbonnement.GRATUIT ? 'Gratuit' : 
                             selectedAdherent.typeAbonnement === TypeAbonnement.MENSUEL ? 'Mensuel' : 'Annuel'}
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="label">Statut:</span>
                          <span className={`value status ${selectedAdherent.abonnementActif ? 'active' : 'inactive'}`}>
                            {selectedAdherent.abonnementActif ? 'Actif' : 'Inactif'}
                          </span>
                        </div>
                        {selectedAdherent.dateFinAbonnement && (
                          <div className="info-item">
                            <span className="label">Expiration:</span>
                            <span className="value">{selectedAdherent.dateFinAbonnement}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'emprunts' && (
                  <div className="adherent-emprunts-tab">
                    <h3>Emprunts ({selectedAdherent.documentsEmpruntes.length})</h3>
                    {selectedAdherent.documentsEmpruntes.length === 0 ? (
                      <p>Aucun emprunt en cours pour cet adhérent.</p>
                    ) : (
                      <table className="emprunts-table">
                        <thead>
                          <tr>
                            <th>Document</th>
                            <th>Date d'emprunt</th>
                            <th>Date de retour prévue</th>
                            <th>Statut</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedAdherent.documentsEmpruntes.map(emprunt => (
                            <tr key={emprunt.id}>
                              <td>Document #{emprunt.documentId}</td>
                              <td>{emprunt.dateEmprunt}</td>
                              <td>{emprunt.dateRetourPrevue}</td>
                              <td>
                                <span className={`status-badge ${emprunt.statut}`}>
                                  {emprunt.statut === StatutEmprunt.EN_COURS ? 'En cours' : 
                                   emprunt.statut === StatutEmprunt.RENDU ? 'Rendu' : 
                                   emprunt.statut === StatutEmprunt.RETARD ? 'En retard' : 'Perdu'}
                                </span>
                              </td>
                              <td>
                                <button className="button small">Détails</button>
                                {emprunt.statut === StatutEmprunt.EN_COURS && (
                                  <button className="button small secondary">Enregistrer le retour</button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
                
                {activeTab === 'amendes' && (
                  <div className="adherent-amendes-tab">
                    <h3>Amendes ({selectedAdherent.amendes.length})</h3>
                    {selectedAdherent.amendes.length === 0 ? (
                      <p>Aucune amende pour cet adhérent.</p>
                    ) : (
                      <table className="amendes-table">
                        <thead>
                          <tr>
                            <th>Emprunt</th>
                            <th>Raison</th>
                            <th>Date</th>
                            <th>Montant</th>
                            <th>Statut</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedAdherent.amendes.map(amende => (
                            <tr key={amende.id}>
                              <td>Emprunt #{amende.empruntId}</td>
                              <td>{amende.raisonAmende}</td>
                              <td>{amende.dateSanction}</td>
                              <td>{amende.montant.toFixed(2)} €</td>
                              <td>
                                <span className={`status-badge ${amende.reglee ? 'paid' : 'unpaid'}`}>
                                  {amende.reglee ? 'Réglée' : 'Non réglée'}
                                </span>
                              </td>
                              <td>
                                <button className="button small">Détails</button>
                                {!amende.reglee && (
                                  <button className="button small secondary">Enregistrer paiement</button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {deleteConfirmOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirmer la suppression</h3>
            <p>Êtes-vous sûr de vouloir supprimer cet adhérent ? Cette action est irréversible.</p>
            <div className="modal-actions">
              <button 
                className="button secondary" 
                onClick={() => setDeleteConfirmOpen(false)}
              >
                Annuler
              </button>
              <button 
                className="button delete" 
                onClick={handleDelete}
              >
                <FaTrash /> Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdherentDetailPage;
