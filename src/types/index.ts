// Types principaux pour l'application

// Type pour un document (livre, DVD, etc.)
export interface Document {
  id: string;
  titre: string;
  auteur: string;
  type: DocumentType;
  description: string;
  isbn?: string;  // Pour les livres
  anneePublication: number;
  editeur: string;
  disponible: boolean;
  dateAjout: string;
  categorie: string;
  image?: string;
  dureeEmpruntMax: number; // En jours
  emplacement: string;
}

export enum DocumentType {
  LIVRE = 'livre',
  PERIODIQUE = 'periodique',
  AUDIO = 'audio',
  DVD = 'dvd',
  BLURAY = 'bluray'
}

// Type pour un utilisateur/adhérent
export interface Adherent {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  dateNaissance: string;
  dateInscription: string;
  abonnementActif: boolean;
  typeAbonnement?: TypeAbonnement;
  dateFinAbonnement?: string;
  documentsEmpruntes: Emprunt[];
  amendes: Amende[];
}

export enum TypeAbonnement {
  GRATUIT = 'gratuit',
  MENSUEL = 'mensuel',
  ANNUEL = 'annuel'
}

export interface Emprunt {
  id: string;
  documentId: string;
  adherentId: string;
  dateEmprunt: string;
  dateRetourPrevue: string;
  dateRetourEffective?: string;
  prolonge: boolean;
  statut: StatutEmprunt;
}

export enum StatutEmprunt {
  EN_COURS = 'en_cours',
  RENDU = 'rendu',
  RETARD = 'retard',
  PERDU = 'perdu'
}

export interface Amende {
  id: string;
  adherentId: string;
  empruntId: string;
  montant: number;
  raisonAmende: RaisonAmende;
  dateSanction: string;
  reglee: boolean;
  dateReglement?: string;
}

export enum RaisonAmende {
  RETARD = 'retard',
  DETERIORATION = 'deterioration',
  PERTE = 'perte'
}

// Type pour un employé
export interface Employe {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: RoleEmploye;
  dateEmbauche: string;
}

export enum RoleEmploye {
  ADMIN = 'admin',
  BIBLIOTHECAIRE = 'bibliothecaire'
}
