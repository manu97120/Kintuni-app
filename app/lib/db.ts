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

export async function getAstrologues() {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT a.*, 
             json_agg(s.*) AS services,
             json_agg(d.date) AS unavailable_dates
      FROM astrologues a
      LEFT JOIN services s ON a.id = s.astrologue_id
      LEFT JOIN unavailable_dates d ON a.id = d.astrologue_id
      GROUP BY a.id
    `);
    return result.rows;
  } finally {
    client.release();
  }
}

export async function createReservation(reservation) {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      INSERT INTO reservations (astrologue_id, service_id, client_name, client_email, date, time, order_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [reservation.astrologue_id, reservation.service_id, reservation.client_name, reservation.client_email, reservation.date, reservation.time, reservation.order_id]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

export { pool };