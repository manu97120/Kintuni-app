import { NextResponse } from "next/server";
import { pool } from "../../lib/db";

export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM Kintuni.services");
    const services = result.rows;
    client.release();
    return NextResponse.json(services);
  } catch (error) {
    console.error("Erreur lors de la récupération des services:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
