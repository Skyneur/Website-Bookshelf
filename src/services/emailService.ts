// Importer nodemailer ou autre service d'emails
import nodemailer from 'nodemailer';
import { formatDate } from '../utils/dateUtils';

class EmailService {
  private transporter: nodemailer.Transporter;
  
  constructor() {
    // En production, configurez avec des variables d'environnement
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'smtp.example.com',
      port: parseInt(process.env.MAIL_PORT || '587', 10),
      secure: process.env.MAIL_SECURE === 'true',
      auth: {
        user: process.env.MAIL_USER || 'user@example.com',
        pass: process.env.MAIL_PASSWORD || 'password',
      },
    });
  }

  /**
   * Envoie un email
   */
  private async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_FROM || '"Médiathèque La Maison du Livre" <biblio@maisondlivre.fr>',
        to,
        subject,
        html,
      });
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      return false;
    }
  }

  /**
   * Envoie une confirmation de prêt
   */
  async sendLoanConfirmation(
    email: string, 
    prenom: string, 
    idPret: number, 
    dateRetour: string
  ): Promise<boolean> {
    const subject = 'Confirmation de votre emprunt - La Maison du Livre';
    const html = `
      <h1>Confirmation d'emprunt</h1>
      <p>Bonjour ${prenom},</p>
      <p>Nous confirmons votre emprunt (référence #${idPret}).</p>
      <p>La date de retour prévue est le <strong>${dateRetour}</strong>.</p>
      <p>Merci de votre visite et bonne lecture !</p>
      <p>L'équipe de La Maison du Livre</p>
    `;
    
    return this.sendEmail(email, subject, html);
  }

  /**
   * Envoie une confirmation de retour
   */
  async sendReturnConfirmation(
    email: string, 
    prenom: string, 
    idPret: number, 
    retard: boolean
  ): Promise<boolean> {
    const subject = 'Confirmation de retour - La Maison du Livre';
    let html = `
      <h1>Confirmation de retour</h1>
      <p>Bonjour ${prenom},</p>
      <p>Nous confirmons le retour de votre emprunt (référence #${idPret}).</p>
    `;
    
    if (retard) {
      html += `
        <p><strong>Note :</strong> Ce document a été rendu avec du retard. 
        Veuillez respecter les délais pour vos prochains emprunts.</p>
      `;
    } else {
      html += `<p>Merci d'avoir respecté le délai de retour.</p>`;
    }
    
    html += `
      <p>Au plaisir de vous revoir prochainement !</p>
      <p>L'équipe de La Maison du Livre</p>
    `;
    
    return this.sendEmail(email, subject, html);
  }

  /**
   * Envoie un rappel pour les documents en retard
   */
  async sendOverdueReminder(
    email: string, 
    prenom: string, 
    idPret: number, 
    joursRetard: number
  ): Promise<boolean> {
    const subject = 'Rappel : Document en retard - La Maison du Livre';
    const html = `
      <h1>Document en retard</h1>
      <p>Bonjour ${prenom},</p>
      <p>Le document que vous avez emprunté (référence #${idPret}) 
      est en retard de <strong>${joursRetard} jour${joursRetard > 1 ? 's' : ''}</strong>.</p>
      <p>Merci de le rapporter à la médiathèque dans les plus brefs délais.</p>
      <p>Pour rappel, des frais de ${(joursRetard * 0.20).toFixed(2)}€ s'appliquent pour ce retard 
      (0,20€ par jour de retard).</p>
      <p>L'équipe de La Maison du Livre</p>
    `;
    
    return this.sendEmail(email, subject, html);
  }

  /**
   * Envoie une notification d'expiration d'abonnement
   */
  async sendSubscriptionExpirationNotice(
    email: string, 
    prenom: string, 
    dateExpiration: Date
  ): Promise<boolean> {
    const subject = 'Votre abonnement expire bientôt - La Maison du Livre';
    const html = `
      <h1>Expiration d'abonnement</h1>
      <p>Bonjour ${prenom},</p>
      <p>Votre abonnement à la médiathèque expire le <strong>${formatDate(dateExpiration)}</strong>.</p>
      <p>Pour continuer à profiter de nos services, pensez à le renouveler lors de votre prochaine visite.</p>
      <p>À bientôt !</p>
      <p>L'équipe de La Maison du Livre</p>
    `;
    
    return this.sendEmail(email, subject, html);
  }
}

export default new EmailService();