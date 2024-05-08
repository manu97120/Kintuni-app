import { object, string, boolean, number } from 'zod';
import { Client } from '@vercel/postgres';

const horoscopeSchema = object({
  date: string(),
  latitude: number(),
  longitude: number(),
  houseSystem: string(),
  zodiacSystem: string(),
  language: string(),
  aspectLevels: object({
    major: boolean(),
    minor: boolean(),
  }),
  customOrbs: object({
    conjunction: number(),
    opposition: number(),
    trine: number(),
    square: number(),
    sextile: number(),
    quincunx: number(),
    quintile: number(),
    septile: number(),
    "semi-square": number(),
    "semi-sextile": number(),
  }),
});

// Create a PostgreSQL client
const client = new Client({
  user: 'your_username',
  password: 'your_password',
  database: 'your_database',
  host: 'localhost',
  port: 5432,
});

// Connect to the database
await client.connect();

// Define a function to save the horoscope
async function saveHoroscope(data) {
  try {
    // Validate input data using Zod schema
    const validatedData = horoscopeSchema.parse(data);
    
    // Insert the validated data into the database
    const result = await client.query(
      'INSERT INTO horoscopes (date, latitude, longitude, house_system, zodiac_system, language, aspect_levels, custom_orbs) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [
        validatedData.date,
        validatedData.latitude,
        validatedData.longitude,
        validatedData.houseSystem,
        validatedData.zodiacSystem,
        validatedData.language,
        JSON.stringify(validatedData.aspectLevels),
        JSON.stringify(validatedData.customOrbs),
      ]
    );
    
    // Log the result
    console.log('Horoscope saved successfully:', result);
  } catch (error) {
    console.error('Error saving horoscope:', error);
  }
}
