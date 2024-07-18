// app/api/getProfile/route.ts
import { NextResponse } from "next/server";
import { pool } from "../../lib/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  
  const client = await pool.connect();

  try {
    console.log(`Tentative de récupération du profil pour l'utilisateur ${userId}`);
    const userQuery = 'SELECT * FROM kintuni.astrologues WHERE id = $1';
    const userResult = await client.query(userQuery, [userId]);

    if (userResult.rowCount === 0) {
      return NextResponse.json({ error: 'Astrologue non trouvé' }, { status: 404 });
    }

    const user = userResult.rows[0];

    const servicesQuery = 'SELECT * FROM kintuni.services WHERE astrologue_id = $1';
    const servicesResult = await client.query(servicesQuery, [userId]);

    const availabilitiesQuery = 'SELECT * FROM kintuni.availabilities WHERE astrologue_id = $1';
    const availabilitiesResult = await client.query(availabilitiesQuery, [userId]);

    const promoCodesQuery = 'SELECT * FROM kintuni.promo_codes WHERE astrologue_id = $1';
    const promoCodesResult = await client.query(promoCodesQuery, [userId]);

    const socialLinksQuery = 'SELECT * FROM kintuni.social_links WHERE astrologue_id = $1';
    const socialLinksResult = await client.query(socialLinksQuery, [userId]);

    const paymentMethodsQuery = 'SELECT * FROM kintuni.payment_methods WHERE astrologue_id = $1';
    const paymentMethodsResult = await client.query(paymentMethodsQuery, [userId]);

    const profile = {
      ...user,
      services: servicesResult.rows,
      availabilities: availabilitiesResult.rows.reduce((acc, { day, start_time, end_time, is_available }) => {
        if (!acc[day]) {
          acc[day] = { isAvailable: is_available, slots: [] };
        }
        acc[day].slots.push({ start: start_time, end: end_time });
        return acc;
      }, {}),
      promoCodes: promoCodesResult.rows,
      socialLinks: socialLinksResult.rows,
      paymentMethods: paymentMethodsResult.rows.map(pm => pm.method),
    };

    console.log(`Profil récupéré avec succès pour l'utilisateur ${userId}`);
    return NextResponse.json(profile);
  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error);
    return NextResponse.json({ error: 'Erreur lors de la récupération du profil' }, { status: 500 });
  } finally {
    client.release();
  }
}