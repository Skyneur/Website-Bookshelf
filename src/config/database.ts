import mysql from 'mysql2/promise';

export const dbPool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'yc4uaml3',
  database: process.env.DB_NAME || 'maison_du_livre',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function testConnection(): Promise<boolean> {
  try {
    const connection = await dbPool.getConnection();
    connection.release();
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}