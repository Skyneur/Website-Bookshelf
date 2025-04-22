import { Request, Response } from 'express';
import documentModel, { Document } from '../models/documentModel';

export class DocumentController {
  async getAllDocuments(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const documents = await documentModel.findAll(limit, offset);
      
      res.status(200).json({
        success: true,
        count: documents.length,
        data: documents
      });
    } catch (error) {
      console.error('Error fetching documents:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des documents'
      });
    }
  }

  async getDocumentById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID invalide'
        });
        return;
      }
      
      const document = await documentModel.findById(id);
      
      if (!document) {
        res.status(404).json({
          success: false,
          message: 'Document non trouvé'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: document
      });
    } catch (error) {
      console.error('Error fetching document:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du document'
      });
    }
  }

  async createDocument(req: Request, res: Response): Promise<void> {
    try {
      const documentData: Document = req.body;
      
      // Validation simple
      if (!documentData.titre || !documentData.cote) {
        res.status(400).json({
          success: false,
          message: 'Le titre et la cote sont obligatoires'
        });
        return;
      }
      
      const id = await documentModel.create(documentData);
      
      res.status(201).json({
        success: true,
        message: 'Document créé avec succès',
        data: { id, ...documentData }
      });
    } catch (error) {
      console.error('Error creating document:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création du document'
      });
    }
  }

  async updateDocument(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const documentData: Partial<Document> = req.body;
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID invalide'
        });
        return;
      }
      
      const success = await documentModel.update(id, documentData);
      
      if (!success) {
        res.status(404).json({
          success: false,
          message: 'Document non trouvé ou aucune modification effectuée'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Document mis à jour avec succès',
        data: { id, ...documentData }
      });
    } catch (error) {
      console.error('Error updating document:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour du document'
      });
    }
  }

  async deleteDocument(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'ID invalide'
        });
        return;
      }
      
      const success = await documentModel.delete(id);
      
      if (!success) {
        res.status(404).json({
          success: false,
          message: 'Document non trouvé'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Document supprimé avec succès'
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression du document'
      });
    }
  }

  async searchDocuments(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query.q as string;
      
      if (!query || query.length < 2) {
        res.status(400).json({
          success: false,
          message: 'Requête de recherche trop courte'
        });
        return;
      }
      
      const documents = await documentModel.search(query);
      
      res.status(200).json({
        success: true,
        count: documents.length,
        data: documents
      });
    } catch (error) {
      console.error('Error searching documents:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la recherche de documents'
      });
    }
  }
}

export default new DocumentController();