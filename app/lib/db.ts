// lib/db.js
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
export async function testDbConnection() {
  let client;
  try {
    console.log("Tentative de connexion à la base de données...");
    client = await pool.connect();
    console.log("Connexion à la base de données réussie");
    return true;
  } catch (error) {
    console.error("Erreur de connexion à la base de données:", error);
    return false;
  } finally {
    if (client) client.release();
  }
}

export { pool };
