import pretModel from '../models/pretModel';
import documentModel from '../models/documentModel';
import adherentModel from '../models/adherentModel';
import abonnementModel from '../models/abonnementModel';
import emailService from './emailService';
import { addDays, formatDate, isAfter } from '../utils/dateUtils';

export class PretService {
  // Configuration du service
  private dureeMaximaleJours = 21; // 3 semaines
  
  async creerPret(idDocument: number, idAdherent: number): Promise<{ success: boolean; message: string; pretId?: number }> {
    try {
      // 1. Vérifier la disponibilité du document
      const disponible = await documentModel.checkAvailability(idDocument);
      if (!disponible) {
        return { success: false, message: 'Ce document n\'est pas disponible' };
      }
      
      // 2. Vérifier si l'adhérent existe et a un abonnement valide
      const adherent = await adherentModel.findById(idAdherent);
      if (!adherent) {
        return { success: false, message: 'Adhérent non trouvé' };
      }
      
      const abonnementValide = await abonnementModel.checkActiveSubscription(idAdherent);
      if (!abonnementValide) {
        return { success: false, message: 'L\'adhérent n\'a pas d\'abonnement valide' };
      }
      
      // 3. Vérifier si l'adhérent n'a pas atteint son quota de prêts
      const pretsCourants = await pretModel.countCurrentLoans(idAdherent);
      if (pretsCourants >= 5) { // Maximum 5 prêts simultanés
        return { success: false, message: 'Quota de prêts atteint (maximum 5)' };
      }

      // 4. Vérifier si l'adhérent n'a pas de retard sur d'autres prêts
      const pretsRetard = await pretModel.countLateLoans(idAdherent);
      if (pretsRetard > 0) {
        return { success: false, message: 'L\'adhérent a des prêts en retard' };
      }
      
      // 5. Créer le prêt
      const dateEmprunt = new Date();
      const dateRetourPrevue = addDays(dateEmprunt, this.dureeMaximaleJours);
      
      const pretId = await pretModel.create({
        id_document: idDocument,
        id_adherent: idAdherent,
        date_emprunt: dateEmprunt,
        date_retour_prevue: dateRetourPrevue,
        statut: 'en cours'
      });
      
      // 6. Mettre à jour la disponibilité du document
      await documentModel.update(idDocument, { disponible: false });
      
      // 7. Envoyer un e-mail de confirmation à l'adhérent
      if (adherent.email) {
        await emailService.sendLoanConfirmation(
          adherent.email,
          adherent.prenom,
          pretId,
          formatDate(dateRetourPrevue)
        );
      }
      
      return { 
        success: true, 
        message: 'Prêt enregistré avec succès',
        pretId
      };
    } catch (error) {
      console.error('Erreur lors de la création du prêt:', error);
      return { success: false, message: 'Erreur lors de la création du prêt' };
    }
  }
  
  async enregistrerRetour(idPret: number): Promise<{ success: boolean; message: string; retard?: boolean }> {
    try {
      // 1. Récupérer les informations du prêt
      const pret = await pretModel.findById(idPret);
      if (!pret) {
        return { success: false, message: 'Prêt non trouvé' };
      }
      
      if (pret.statut === 'rendu') {
        return { success: false, message: 'Ce document a déjà été rendu' };
      }
      
      // 2. Vérifier si le retour est en retard
      const aujourdhui = new Date();
      const retard = isAfter(aujourdhui, new Date(pret.date_retour_prevue));
      
      // 3. Mettre à jour le prêt
      await pretModel.update(idPret, {
        date_retour_effective: aujourdhui,
        statut: retard ? 'rendu en retard' : 'rendu'
      });
      
      // 4. Rendre le document disponible
      await documentModel.update(pret.id_document, { disponible: true });
      
      // 5. Envoyer un e-mail de confirmation
      const adherent = await adherentModel.findById(pret.id_adherent);
      if (adherent && adherent.email) {
        await emailService.sendReturnConfirmation(
          adherent.email,
          adherent.prenom,
          idPret,
          retard
        );
      }
      
      return { 
        success: true,
        message: 'Retour enregistré avec succès',
        retard
      };
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du retour:', error);
      return { success: false, message: 'Erreur lors de l\'enregistrement du retour' };
    }
  }
  
  async verifierPretEnRetard(): Promise<void> {
    try {
      // 1. Récupérer tous les prêts en retard
      const pretsEnRetard = await pretModel.findOverdueLoans();
      
      // 2. Pour chaque prêt en retard, envoyer un rappel
      for (const pret of pretsEnRetard) {
        // Mettre à jour le statut du prêt
        if (pret.statut !== 'retard') {
          await pretModel.update(pret.id, { statut: 'retard' });
        }
        
        // Récupérer les informations de l'adhérent
        const adherent = await adherentModel.findById(pret.id_adherent);
        if (adherent && adherent.email) {
          // Calculer le nombre de jours de retard
          const joursRetard = Math.floor(
            (new Date().getTime() - new Date(pret.date_retour_prevue).getTime()) / 
            (1000 * 60 * 60 * 24)
          );
          
          // Envoyer le rappel
          await emailService.sendOverdueReminder(
            adherent.email,
            adherent.prenom,
            pret.id,
            joursRetard
          );
        }
      }
    } catch (error) {
      console.error('Erreur lors de la vérification des prêts en retard:', error);
    }
  }
}

export default new PretService();