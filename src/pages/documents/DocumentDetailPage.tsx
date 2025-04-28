import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { RootState, AppDispatch } from '../../store';
import { setSelectedDocument } from '../../store/slices/documentsSlice';
import { Document, DocumentType } from '../../types';
import { FaArrowLeft, FaSave, FaTrash } from 'react-icons/fa';
import { addNotification } from '../../store/slices/uiSlice';

interface DocumentDetailPageProps {
  isNew?: boolean;
}

const DocumentDetailPage: React.FC<DocumentDetailPageProps> = ({ isNew = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedDocument, loading, error } = useSelector((state: RootState) => state.documents);
  const [isEditing, setIsEditing] = useState(isNew);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    // Si c'est un nouveau document, initialiser un objet vide
    // Sinon, récupérer le document par son ID (simulation)
    if (isNew) {
      dispatch(setSelectedDocument(null));
    } else if (id) {
      // Simuler un appel API pour récupérer les détails du document
      // Dans une application réelle, vous feriez un appel API ici
      const mockDocument: Document = {
        id,
        titre: 'Exemple de livre',
        auteur: 'Auteur Test',
        type: DocumentType.LIVRE,
        description: 'Description détaillée du livre...',
        isbn: '978-3-16-148410-0',
        anneePublication: 2020,
        editeur: 'Éditions Test',
        disponible: true,
        dateAjout: '2023-01-15',
        categorie: 'Roman',
        dureeEmpruntMax: 21,
        emplacement: 'Étagère A-12'
      };
      
      setTimeout(() => {
        dispatch(setSelectedDocument(mockDocument));
      }, 500);
    }

    // Nettoyer la sélection lors du démontage du composant
    return () => {
      dispatch(setSelectedDocument(null));
    };
  }, [dispatch, id, isNew]);

  const initialValues: Partial<Document> = selectedDocument || {
    titre: '',
    auteur: '',
    type: DocumentType.LIVRE,
    description: '',
    isbn: '',
    anneePublication: new Date().getFullYear(),
    editeur: '',
    disponible: true,
    categorie: '',
    dureeEmpruntMax: 21,
    emplacement: ''
  };

  const validationSchema = Yup.object({
    titre: Yup.string().required('Le titre est obligatoire'),
    auteur: Yup.string().required('L\'auteur est obligatoire'),
    type: Yup.string().required('Le type est obligatoire'),
    anneePublication: Yup.number()
      .required('L\'année de publication est obligatoire')
      .min(1000, 'Année invalide')
      .max(new Date().getFullYear(), 'L\'année ne peut pas être dans le futur'),
    editeur: Yup.string().required('L\'éditeur est obligatoire'),
    categorie: Yup.string().required('La catégorie est obligatoire'),
    dureeEmpruntMax: Yup.number()
      .required('La durée maximale d\'emprunt est obligatoire')
      .positive('Doit être un nombre positif'),
    emplacement: Yup.string().required('L\'emplacement est obligatoire')
  });

  const handleSubmit = (values: Partial<Document>) => {
    // Simulation de l'enregistrement du document
    console.log('Document soumis:', values);
    
    dispatch(addNotification({
      message: isNew 
        ? 'Le document a été créé avec succès.' 
        : 'Les modifications ont été enregistrées.',
      type: 'success'
    }));
    
    // Rediriger vers la liste des documents
    setTimeout(() => {
      navigate('/documents');
    }, 1500);
  };

  const handleDelete = () => {
    // Simulation de la suppression
    console.log(`Suppression du document ${id}`);
    
    dispatch(addNotification({
      message: 'Le document a été supprimé.',
      type: 'success'
    }));
    
    // Rediriger vers la liste des documents
    navigate('/documents');
  };

  if (loading || (!selectedDocument && !isNew)) {
    return <div className="loading-indicator">Chargement du document...</div>;
  }

  if (error && !isNew) {
    return <div className="error-message">Erreur: {error}</div>;
  }

  return (
    <div className="document-detail-page">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate('/documents')}>
          <FaArrowLeft /> Retour à la liste
        </button>
        <h1>{isNew ? 'Nouveau document' : isEditing ? 'Modifier le document' : initialValues.titre}</h1>
        
        {!isNew && !isEditing && (
          <div className="action-buttons">
            <button className="button" onClick={() => setIsEditing(true)}>Modifier</button>
            <button className="button secondary" onClick={() => setDeleteConfirmOpen(true)}>Supprimer</button>
          </div>
        )}
      </div>

      {isEditing ? (
        <Formik
          initialValues={initialValues as Document}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form className="document-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="titre">Titre</label>
                  <Field name="titre" id="titre" type="text" />
                  <ErrorMessage name="titre" component="div" className="error-message" />
                </div>

                <div className="form-group">
                  <label htmlFor="auteur">Auteur</label>
                  <Field name="auteur" id="auteur" type="text" />
                  <ErrorMessage name="auteur" component="div" className="error-message" />
                </div>

                <div className="form-group">
                  <label htmlFor="type">Type de document</label>
                  <Field as="select" name="type" id="type">
                    <option value={DocumentType.LIVRE}>Livre</option>
                    <option value={DocumentType.PERIODIQUE}>Périodique</option>
                    <option value={DocumentType.AUDIO}>Document sonore</option>
                    <option value={DocumentType.DVD}>DVD</option>
                    <option value={DocumentType.BLURAY}>Blu-Ray</option>
                  </Field>
                  <ErrorMessage name="type" component="div" className="error-message" />
                </div>

                <div className="form-group">
                  <label htmlFor="anneePublication">Année de publication</label>
                  <Field name="anneePublication" id="anneePublication" type="number" />
                  <ErrorMessage name="anneePublication" component="div" className="error-message" />
                </div>

                <div className="form-group">
                  <label htmlFor="editeur">Éditeur</label>
                  <Field name="editeur" id="editeur" type="text" />
                  <ErrorMessage name="editeur" component="div" className="error-message" />
                </div>

                <div className="form-group">
                  <label htmlFor="isbn">ISBN (optionnel)</label>
                  <Field name="isbn" id="isbn" type="text" />
                  <ErrorMessage name="isbn" component="div" className="error-message" />
                </div>

                <div className="form-group">
                  <label htmlFor="categorie">Catégorie</label>
                  <Field name="categorie" id="categorie" type="text" />
                  <ErrorMessage name="categorie" component="div" className="error-message" />
                </div>

                <div className="form-group">
                  <label htmlFor="emplacement">Emplacement</label>
                  <Field name="emplacement" id="emplacement" type="text" />
                  <ErrorMessage name="emplacement" component="div" className="error-message" />
                </div>

                <div className="form-group">
                  <label htmlFor="dureeEmpruntMax">Durée maximale d'emprunt (jours)</label>
                  <Field name="dureeEmpruntMax" id="dureeEmpruntMax" type="number" min="1" />
                  <ErrorMessage name="dureeEmpruntMax" component="div" className="error-message" />
                </div>

                <div className="form-group checkbox-group">
                  <label>
                    <Field name="disponible" type="checkbox" />
                    Disponible
                  </label>
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="description">Description</label>
                <Field as="textarea" name="description" id="description" rows="5" />
                <ErrorMessage name="description" component="div" className="error-message" />
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="button secondary"
                  onClick={() => {
                    if (isNew) navigate('/documents');
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
        <div className="document-details">
          {selectedDocument && (
            <>
              <div className="document-header">
                <div className="document-image-container">
                  <img 
                    src={selectedDocument.image || '/placeholder-book.png'}
                    alt={selectedDocument.titre} 
                    className="document-image"
                  />
                </div>
                <div className="document-header-info">
                  <h2>{selectedDocument.titre}</h2>
                  <p className="author">Par {selectedDocument.auteur}</p>
                  <p className="publisher">{selectedDocument.editeur}, {selectedDocument.anneePublication}</p>
                  <p className={`availability ${selectedDocument.disponible ? 'available' : 'unavailable'}`}>
                    {selectedDocument.disponible ? 'Disponible' : 'Emprunté'}
                  </p>
                </div>
              </div>
              
              <div className="document-body">
                <div className="document-section">
                  <h3>Détails</h3>
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="label">Type:</span>
                      <span className="value">{selectedDocument.type}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Catégorie:</span>
                      <span className="value">{selectedDocument.categorie}</span>
                    </div>
                    {selectedDocument.isbn && (
                      <div className="detail-item">
                        <span className="label">ISBN:</span>
                        <span className="value">{selectedDocument.isbn}</span>
                      </div>
                    )}
                    <div className="detail-item">
                      <span className="label">Emplacement:</span>
                      <span className="value">{selectedDocument.emplacement}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Durée d'emprunt:</span>
                      <span className="value">{selectedDocument.dureeEmpruntMax} jours</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Date d'ajout:</span>
                      <span className="value">{selectedDocument.dateAjout}</span>
                    </div>
                  </div>
                </div>
                
                <div className="document-section">
                  <h3>Description</h3>
                  <p>{selectedDocument.description || "Aucune description disponible."}</p>
                </div>
                
                <div className="document-section">
                  <h3>Historique des emprunts</h3>
                  <p>Aucun historique d'emprunt disponible pour ce document.</p>
                </div>
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
            <p>Êtes-vous sûr de vouloir supprimer ce document ? Cette action est irréversible.</p>
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

export default DocumentDetailPage;
