// app/api/send-confirmation/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request) {
  const { name, email, astrologue, service, date, time, orderId } = await request.json();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Confirmation de Réservation - KintuniAI",
    text: `
      Bonjour ${name},

      Votre réservation a été confirmée avec l'astrologue ${astrologue} pour le service ${service}.
      
      Détails de la réservation:
      Date: ${date}
      Heure: ${time}
      Numéro de commande: ${orderId}

      Merci d'utiliser KintuniAI.

      Cordialement,
      L'équipe KintuniAI
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'e-mail:", error);
    return NextResponse.json({ error: "Erreur lors de l'envoi de l'e-mail" }, { status: 500 });
  }
}