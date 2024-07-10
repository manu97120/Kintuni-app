import { NextResponse } from "next/server";
import { google } from "googleapis";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const { name, email, astrologue, service, date, time, orderId } =
    await req.json();

  try {
    const auth = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      process.env.GMAIL_REDIRECT_URI,
    );

    auth.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });

    const accessToken = await auth.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.GMAIL_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Confirmation de votre réservation KintuniAI",
      html: `
        <h1>Confirmation de réservation</h1>
        <p>Cher(e) ${name},</p>
        <p>Votre réservation a été confirmée avec les détails suivants :</p>
        <ul>
          <li>Astrologue : ${astrologue}</li>
          <li>Service : ${service}</li>
          <li>Date : ${date}</li>
          <li>Heure : ${time}</li>
          <li>Numéro de commande : ${orderId}</li>
        </ul>
        <p>Merci d'avoir choisi KintuniAI pour votre consultation astrologique.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      message: "Confirmation email sent successfully",
    });
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    return NextResponse.json(
      { message: "Failed to send confirmation email" },
      { status: 500 },
    );
  }
}
