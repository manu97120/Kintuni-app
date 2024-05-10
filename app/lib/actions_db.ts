'use server';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
// import { Horoscope } from './circularNatalHoro';

const HoroscopeSchema = z.object({
  id: z.string(),
  // customerId: z.string(),
  date: z.string(),
  time: z.string(),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  houseSystem: z.string(),
  zodiacSystem: z.string(),
  language: z.string(),
  aspectLevels: z.object({
    major: z.boolean(),
    minor: z.boolean(),
  }),
  customOrbs: z.object({
    conjunction: z.coerce.number(),
    opposition: z.coerce.number(),
    trine: z.coerce.number(),
    square: z.coerce.number(),
    sextile: z.coerce.number(),
    quincunx: z.coerce.number(),
    quintile: z.coerce.number(),
    septile: z.coerce.number(),
    "semi-square": z.coerce.number(),
    "semi-sextile": z.coerce.number(),
  }),
});

const CreateHoroscope = HoroscopeSchema.omit({ id: true });

// Define a function to save the horoscope
export async function saveHoroscope(horoscopeFormData: {
  date: string; time: string; latitude: string; longitude: string;
  houseSystem: string; zodiacSystem: string; language: string;
  aspectLevels: { major: boolean; minor: boolean; };
  customOrbs: {
    conjunction: number; opposition: number; trine: number;
    square: number; sextile: number; quincunx: number; quintile: number;
    septile: number; "semi-square": number; "semi-sextile": number;
  };
}) {
  console.log("::: Save horoscope generated", horoscopeFormData);


  try {
    // const client = new Client({

    // });
    // Validate input data using Zod schema
    const { date, time, latitude,
      longitude,
      houseSystem,
      zodiacSystem,
      language,
      aspectLevels,
      customOrbs
    } = CreateHoroscope.parse(horoscopeFormData);

    // Insert the validated data into the database
    const result = await sql
      `INSERT INTO horoscopes (
          date,time, latitude,
          longitude,
          house_system,
          zodiac_system,
          language,
          aspect_levels,
          custom_orbs
        ) 
        VALUES (
          ${date},
          ${time},
          ${latitude},
          ${longitude},
          ${houseSystem},
          ${zodiacSystem},
          ${language},
          ${JSON.stringify(aspectLevels)},
          ${JSON.stringify(customOrbs)}
        )`;

    // Log the result
    console.log('Horoscope saved successfully:', result);

  } catch (error) {
    console.error('Error saving horoscope:', error);
  }
  // to check to adjust app comportement on submittion
    // revalidatePath('/horoscope');
    // redirect('/horoscope');
}
