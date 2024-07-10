// app/api/astrologues/route.ts
import { NextResponse } from "next/server";
import { pool } from "../../lib/db";

export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM Kintuni.astrologues");
    const astrologues = result.rows;
    client.release();
    return NextResponse.json(astrologues);
  } catch (error) {
    console.error("Erreur lors de la récupération des astrologues:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
