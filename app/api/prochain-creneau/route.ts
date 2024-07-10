import { NextResponse } from "next/server";
import { pool } from "../../lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const astrologueId = searchParams.get("astrologueId");

  if (!astrologueId) {
    return NextResponse.json(
      { error: "astrologueId est requis" },
      { status: 400 },
    );
  }

  try {
    const client = await pool.connect();
    const result = await client.query(
      `SELECT MIN(date_heure) as prochain_creneau
       FROM Kintuni.disponibilites
       WHERE astrologue_id = $1 AND date_heure > NOW()
       AND NOT EXISTS (
         SELECT 1 FROM Kintuni.rendez_vous
         WHERE astrologue_id = $1 AND date_heure = disponibilites.date_heure
       )`,
      [astrologueId],
    );
    const prochainCreneau = result.rows[0].prochain_creneau;
    client.release();
    return NextResponse.json({ prochainCreneau });
  } catch (error) {
    console.error("Erreur lors de la récupération du prochain créneau:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
