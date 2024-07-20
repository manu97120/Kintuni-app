// next.config.mjs
import { config } from 'dotenv';
config();

export default {
  reactStrictMode: true,
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
};