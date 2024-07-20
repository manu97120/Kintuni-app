// testOpenAI.js
const OpenAI = require('openai');
require('dotenv').config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

async function testOpenAI() {
  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        {
          role: "user",
          content: "quelle version open ai est ce que tu utilises dans cette conversation?",
        },
      ],
    });
    console.log('AI Response:', completion.choices[0].message.content.trim());
  } catch (error) {
    console.error("Error fetching AI analysis:", error);
  }
}

testOpenAI();