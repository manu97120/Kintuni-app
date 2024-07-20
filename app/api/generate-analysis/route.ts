// /app/api/generate-analysis/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error("Missing OpenAI API key");
}

const client = new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true,
});

export async function POST(req: NextRequest) {
  if (!apiKey) {
    return NextResponse.json({ error: "Missing OpenAI API key" }, { status: 500 });
  }

  try {
    const { data } = await req.json();
    console.log('Received data:', data); // Ajout de log pour les données reçues

    const completion = await client.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an astrology assistant.",
        },
        {
          role: "user",
          content: `Generate a detailed celestial analysis for the following data: ${JSON.stringify(data)}`,
        },
      ],
      max_tokens: 150,
    });

    console.log('AI completion received:', completion); // Ajout de log pour la réponse AI

    return NextResponse.json({ analysis: completion.choices[0].message.content.trim() });
  } catch (error) {
    console.error("Error fetching AI analysis:", error);
    return NextResponse.json({ error: "There was an error generating your celestial analysis. Please try again later." }, { status: 500 });
  }
}