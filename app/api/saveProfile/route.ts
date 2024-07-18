// app/api/saveProfile/route.ts
import { NextResponse } from "next/server";
import { pool } from "../../lib/db";

export async function POST(req) {
  console.log("Requête reçue pour sauvegarder le profil");
  const { profile } = await req.json();
  console.log("Données reçues :", { profile });

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Vérifiez l'existence de la table astrologues
    const tableCheckQuery = `SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'kintuni' AND table_name = 'astrologues'
    );`;
    const tableCheckResult = await client.query(tableCheckQuery);
    console.log("Vérification de l'existence de la table astrologues :", tableCheckResult.rows[0].exists);

    if (!tableCheckResult.rows[0].exists) {
      throw new Error("La table astrologues n'existe pas dans le schéma kintuni");
    }

    // Insert new astrologue
    console.log("Insertion d'un nouvel astrologue");
    const insertAstrologueQuery = `
      INSERT INTO kintuni.astrologues (name, avatar, description, paypal_email, notice_period, use_calendly, calendly_token)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `;
    const result = await client.query(insertAstrologueQuery, [
      profile.name,
      profile.avatar,
      profile.description,
      profile.paypalEmail,
      profile.noticePeriod,
      profile.useCalendly,
      profile.calendlyToken
    ]);
    const userId = result.rows[0].id;
    console.log("Nouvel astrologue inséré avec l'ID :", userId);

    // Update services
    console.log("Mise à jour des services");
    const insertServiceQuery = `
      INSERT INTO kintuni.services (astrologue_id, name, description, price, duration)
      VALUES ($1, $2, $3, $4, $5)
    `;
    for (const service of profile.services) {
      await client.query(insertServiceQuery, [
        userId,
        service.name,
        service.description,
        service.price,
        service.duration
      ]);
    }

    // Update availabilities
    console.log("Mise à jour des disponibilités");
    const insertAvailabilityQuery = `
      INSERT INTO kintuni.availabilities (astrologue_id, day, start_time, end_time, is_available)
      VALUES ($1, $2, $3, $4, $5)
    `;
    for (const [day, { isAvailable, slots }] of Object.entries(profile.availabilities)) {
      for (const slot of slots) {
        await client.query(insertAvailabilityQuery, [
          userId,
          day,
          slot.start,
          slot.end,
          isAvailable
        ]);
      }
    }

    // Update promo codes
    console.log("Mise à jour des codes promo");
    const insertPromoCodeQuery = `
      INSERT INTO kintuni.promo_codes (astrologue_id, code, discount)
      VALUES ($1, $2, $3)
    `;
    for (const promoCode of profile.promoCodes) {
      await client.query(insertPromoCodeQuery, [
        userId,
        promoCode.code,
        promoCode.discount
      ]);
    }

    // Update social links
    console.log("Mise à jour des liens sociaux");
    const insertSocialLinkQuery = `
      INSERT INTO kintuni.social_links (astrologue_id, platform, url)
      VALUES ($1, $2, $3)
    `;
    for (const socialLink of profile.socialLinks) {
      await client.query(insertSocialLinkQuery, [
        userId,
        socialLink.platform,
        socialLink.url
      ]);
    }

    // Update payment methods
    console.log("Mise à jour des méthodes de paiement");
    const insertPaymentMethodQuery = `
      INSERT INTO kintuni.payment_methods (astrologue_id, method)
      VALUES ($1, $2)
    `;
    for (const method of profile.paymentMethods) {
      await client.query(insertPaymentMethodQuery, [
        userId,
        method
      ]);
    }

    await client.query('COMMIT');
    console.log("Profil sauvegardé avec succès");
    return NextResponse.json({ message: 'Profil sauvegardé avec succès' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Erreur lors de la sauvegarde du profil:", error);
    return NextResponse.json({ error: 'Erreur lors de la sauvegarde du profil' }, { status: 500 });
  } finally {
    client.release();
    console.log("Connexion à la base de données relâchée");
  }
}