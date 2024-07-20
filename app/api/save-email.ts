import { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { date, time, longitude, latitude, email } = req.body;
    const uid = `${date.replace(/-/g, '/')}-${time.replace(/:/g, '')}-${longitude}-${latitude}`;
    const timestamp = new Date().toISOString();

    try {
      const emailToStore = email || "non renseigné";
      await pool.query(`INSERT INTO B2C (uid, email, timestamp) VALUES ($1, $2, $3)`, [uid, emailToStore, timestamp]);
      res.status(200).json({ message: 'Data saved successfully' });
    } catch (error) {
      console.error("Erreur lors de l'insertion dans la base de données:", error);
      res.status(500).json({ error: 'Failed to save data' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}