import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
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

const createTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS B2C (
      uid TEXT PRIMARY KEY,
      email TEXT,
      timestamp TEXT
    );
  `;
  await pool.query(query);
};

createTable();

export default pool;