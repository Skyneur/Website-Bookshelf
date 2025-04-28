Conception d'un système de gestion pour "La maison du Livre"
Modèle Conceptuel de Données (MCD)
Voici une proposition de MCD pour votre système de gestion de médiathèque :

Entités principales
Document (id, titre, type, date_acquisition, statut, image_couverture)
Livre (id_document, auteur, isbn, éditeur, année_publication, résumé, nb_pages)
Périodique (id_document, périodicité, numéro, date_parution)
DocumentSonore (id_document, artiste, durée, format)
MediaVisuel (id_document, réalisateur, durée, format)
Adhérent (id, nom, prénom, date_naissance, adresse, code_postal, ville, email, téléphone, date_inscription)
Abonnement (id, id_adhérent, type_abonnement, date_début, date_fin, montant)
Prêt (id, id_document, id_adhérent, date_emprunt, date_retour_prévue, date_retour_effective, statut)
Employé (id, nom, prénom, email, mot_de_passe, rôle)
Contentieux (id, id_prêt, type, date_signalement, statut, commentaire)
Relations
Un Adhérent peut avoir plusieurs Abonnements (historique)
Un Adhérent peut effectuer plusieurs Prêts
Un Document peut être associé à plusieurs Prêts (historique)
Un Prêt peut générer un Contentieux
