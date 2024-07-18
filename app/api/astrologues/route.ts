// app/api/astrologues/route.ts

import { NextResponse } from "next/server";
import { pool } from "../../lib/db";

export async function GET() {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT a.*, 
             json_agg(s.*) AS services
             -- json_agg(d.date) AS unavailable_dates -- Commenté car la table unavailable_dates n'existe pas actuellement
      FROM kintuni.astrologues a
      LEFT JOIN kintuni.services s ON a.id = s.astrologue_id
      -- LEFT JOIN kintuni.unavailable_dates d ON a.id = d.astrologue_id -- Commenté car la table unavailable_dates n'existe pas actuellement
      GROUP BY a.id
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des astrologues:", error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des astrologues' }, { status: 500 });
  } finally {
    client.release();
  }
}