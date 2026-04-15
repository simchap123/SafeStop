import { betterAuth } from "better-auth";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

export const auth = betterAuth({
  database: pool,
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [
    "http://68.183.20.8",
    "http://68.183.20.8:3000",
    "https://test.shulgenius.com",
    "http://localhost:3000",
    "http://localhost:8081",
    "http://localhost:19006",
    "https://safestop-app-kappa.vercel.app",
  ],
});
