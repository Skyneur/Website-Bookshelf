import { dbPool } from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface Document {
  id?: number;
  titre: string;
  annee_publication?: number;
  editeur?: string;
  cote: string;
  disponible: boolean;
  date_acquisition?: Date;
  prix?: number;
  commentaire?: string;
}

export class DocumentModel {
  async findAll(limit = 50, offset = 0): Promise<Document[]> {
    const [rows] = await dbPool.execute<RowDataPacket[]>(
      'SELECT * FROM document LIMIT ? OFFSET ?',
      [limit, offset]
    );
    return rows as Document[];
  }

  async findById(id: number): Promise<Document | null> {
    const [rows] = await dbPool.execute<RowDataPacket[]>(
      'SELECT * FROM document WHERE id = ?',
      [id]
    );
    return rows.length ? (rows[0] as Document) : null;
  }

  async create(document: Document): Promise<number> {
    const [result] = await dbPool.execute<ResultSetHeader>(
      'INSERT INTO document (titre, annee_publication, editeur, cote, disponible, date_acquisition, prix, commentaire) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [document.titre, document.annee_publication, document.editeur, document.cote, document.disponible, document.date_acquisition, document.prix, document.commentaire]
    );
    return result.insertId;
  }

  async update(id: number, document: Partial<Document>): Promise<boolean> {
    // Construire la requête dynamique en fonction des champs fournis
    const fields = Object.keys(document).map(key => `${key} = ?`).join(', ');
    const values = Object.values(document);
    
    const [result] = await dbPool.execute<ResultSetHeader>(
      `UPDATE document SET ${fields} WHERE id = ?`,
      [...values, id]
    );
    
    return result.affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await dbPool.execute<ResultSetHeader>(
      'DELETE FROM document WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  async search(query: string): Promise<Document[]> {
    const searchQuery = `%${query}%`;
    const [rows] = await dbPool.execute<RowDataPacket[]>(
      'SELECT * FROM document WHERE titre LIKE ? OR editeur LIKE ? OR cote LIKE ? OR commentaire LIKE ? LIMIT 50',
      [searchQuery, searchQuery, searchQuery, searchQuery]
    );
    return rows as Document[];
  }
  
  async checkAvailability(id: number): Promise<boolean> {
    const [rows] = await dbPool.execute<RowDataPacket[]>(
      'SELECT disponible FROM document WHERE id = ?',
      [id]
    );
    return rows.length ? Boolean(rows[0].disponible) : false;
  }
}

export default new DocumentModel();