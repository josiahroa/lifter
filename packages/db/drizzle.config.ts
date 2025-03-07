import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();

const DATABASE_URL = `mysql://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/${process.env.DATABASE}`;

export default defineConfig({
  out: "./migrations",
  schema: "./schema.ts",
  dialect: "mysql",
  dbCredentials: {
    url: DATABASE_URL,
  },
});
