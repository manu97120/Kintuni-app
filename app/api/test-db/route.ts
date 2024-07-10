import { NextResponse } from "next/server";
import { testDbConnection } from "../../lib/db";

export async function GET() {
  try {
    const isConnected = await testDbConnection();
    if (isConnected) {
      return NextResponse.json({
        message: "Connexion à la base de données réussie",
      });
    } else {
      return NextResponse.json(
        { error: "Échec de la connexion à la base de données" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Erreur lors du test de connexion:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
