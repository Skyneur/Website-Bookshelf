-- Table des documents (abstraite)
CREATE TABLE document (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titre VARCHAR(255) NOT NULL,
    annee_publication INT,
    editeur VARCHAR(255),
    cote VARCHAR(50) NOT NULL UNIQUE,
    disponible BOOLEAN DEFAULT TRUE,
    date_acquisition DATE,
    prix DECIMAL(10,2),
    commentaire TEXT
);

-- Table des livres
CREATE TABLE livre (
    id_document INT PRIMARY KEY,
    isbn VARCHAR(20) UNIQUE,
    nombre_pages INT,
    langue VARCHAR(50),
    FOREIGN KEY (id_document) REFERENCES document(id) ON DELETE CASCADE
);

-- Table des périodiques
CREATE TABLE periodique (
    id_document INT PRIMARY KEY,
    issn VARCHAR(20),
    periodicite VARCHAR(50),
    numero VARCHAR(50),
    FOREIGN KEY (id_document) REFERENCES document(id) ON DELETE CASCADE
);

-- Table des documents sonores
CREATE TABLE document_sonore (
    id_document INT PRIMARY KEY,
    duree INT, -- en minutes
    format VARCHAR(50),
    FOREIGN KEY (id_document) REFERENCES document(id) ON DELETE CASCADE
);

-- Table des DVD/Blu-Ray
CREATE TABLE dvd_bluray (
    id_document INT PRIMARY KEY,
    duree INT, -- en minutes
    format VARCHAR(50),
    age_minimum INT,
    FOREIGN KEY (id_document) REFERENCES document(id) ON DELETE CASCADE
);

-- Table des personnes (abstraite)
CREATE TABLE personne (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    date_naissance DATE,
    adresse TEXT,
    code_postal VARCHAR(10),
    ville VARCHAR(100),
    email VARCHAR(255) UNIQUE,
    telephone VARCHAR(20)
);

-- Table des adhérents
CREATE TABLE adherent (
    id_personne INT PRIMARY KEY,
    numero_adherent VARCHAR(20) UNIQUE,
    statut VARCHAR(50), -- étudiant, résident, etc.
    date_inscription DATE,
    FOREIGN KEY (id_personne) REFERENCES personne(id) ON DELETE CASCADE
);

-- Table des employés
CREATE TABLE employe (
    id_personne INT PRIMARY KEY,
    login VARCHAR(50) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    role VARCHAR(50), -- administrateur, bibliothécaire, etc.
    date_embauche DATE,
    FOREIGN KEY (id_personne) REFERENCES personne(id) ON DELETE CASCADE
);

-- Table des abonnements
CREATE TABLE abonnement (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_adherent INT,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    type VARCHAR(50), -- mensuel, annuel, etc.
    cout DECIMAL(10,2),
    statut VARCHAR(50), -- actif, expiré, etc.
    FOREIGN KEY (id_adherent) REFERENCES adherent(id_personne)
);

-- Table des prêts
CREATE TABLE pret (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_document INT,
    id_adherent INT,
    date_emprunt DATE NOT NULL,
    date_retour_prevue DATE NOT NULL,
    date_retour_effective DATE,
    statut VARCHAR(50), -- en cours, rendu, retard, etc.
    FOREIGN KEY (id_document) REFERENCES document(id),
    FOREIGN KEY (id_adherent) REFERENCES adherent(id_personne)
);

-- Table des auteurs
CREATE TABLE auteur (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100),
    date_naissance DATE,
    nationalite VARCHAR(50)
);

-- Table de liaison document-auteur
CREATE TABLE document_auteur (
    id_document INT,
    id_auteur INT,
    role VARCHAR(50), -- auteur principal, illustrateur, etc.
    PRIMARY KEY (id_document, id_auteur, role),
    FOREIGN KEY (id_document) REFERENCES document(id),
    FOREIGN KEY (id_auteur) REFERENCES auteur(id)
);