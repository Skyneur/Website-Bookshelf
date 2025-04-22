import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import employeModel from '../models/employeModel';

// Extension de l'interface Request pour inclure l'employé
declare global {
  namespace Express {
    interface Request {
      employe?: {
        id: number;
        role: string;
      };
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Authentification requise'
      });
      return;
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key') as {
      id: number;
      role: string;
    };
    
    // Vérifier que l'employé existe toujours
    const employe = await employeModel.findById(decoded.id);
    
    if (!employe) {
      res.status(401).json({
        success: false,
        message: 'Employé non trouvé'
      });
      return;
    }
    
    // Ajouter les informations de l'employé à la requête
    req.employe = {
      id: decoded.id,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({
      success: false,
      message: 'Token invalide ou expiré'
    });
  }
};

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.employe) {
      res.status(401).json({
        success: false,
        message: 'Authentification requise'
      });
      return;
    }
    
    if (!roles.includes(req.employe.role)) {
      res.status(403).json({
        success: false,
        message: 'Accès non autorisé'
      });
      return;
    }
    
    next();
  };
};