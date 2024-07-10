import { NextResponse } from "next/server";
import { pool } from "../../lib/db";

export async function POST(request: Request) {
  const { astrologueId, serviceId, dateHeure, clientName, clientEmail } =
    await request.json();

  try {
    const client = await pool.connect();

    // Vérifier si le créneau est disponible
    const disponibiliteCheck = await client.query(
      "SELECT * FROM Kintuni.disponibilites WHERE astrologue_id = $1 AND date_heure = $2",
      [astrologueId, dateHeure],
    );

    if (disponibiliteCheck.rows.length === 0) {
      client.release();
      return NextResponse.json(
        { error: "Ce créneau n'est pas disponible" },
        { status: 400 },
      );
    }

    // Insérer le rendez-vous
    await client.query(
      "INSERT INTO Kintuni.rendez_vous (astrologue_id, service_id, client_name, client_email, date_heure) VALUES ($1, $2, $3, $4, $5)",
      [astrologueId, serviceId, clientName, clientEmail, dateHeure],
    );

    // Supprimer la disponibilité
    await client.query(
      "DELETE FROM Kintuni.disponibilites WHERE astrologue_id = $1 AND date_heure = $2",
      [astrologueId, dateHeure],
    );

    client.release();
    return NextResponse.json({ message: "Réservation effectuée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la réservation:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
