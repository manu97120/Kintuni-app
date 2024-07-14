import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  const clientID = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_SECRET;
  const auth = Buffer.from(`${clientID}:${secret}`).toString("base64");

  const tokenResponse = await axios.post(
    "https://api.sandbox.paypal.com/v1/oauth2/token",
    "grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  const accessToken = tokenResponse.data.access_token;

  const { recipientEmail, amount } = await request.json();

  const payoutResponse = await axios.post(
    "https://api.sandbox.paypal.com/v1/payments/payouts",
    {
      sender_batch_header: {
        email_subject: "You have a payment",
      },
      items: [
        {
          recipient_type: "EMAIL",
          amount: {
            value: amount,
            currency: "USD",
          },
          receiver: recipientEmail,
          note: "Thank you for using our service!",
          sender_item_id: "item_1",
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );

  return NextResponse.json(payoutResponse.data);
}
