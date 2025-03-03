import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const DATABASE_URL = `mysql://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/${process.env.DATABASE}`;

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "mysql",
  dbCredentials: {
    url: DATABASE_URL,
  },
});
