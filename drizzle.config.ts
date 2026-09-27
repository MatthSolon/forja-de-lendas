import "dotenv/config";
import { defineConfig } from "drizzle-kit";

// A URL vem de DATABASE_URL (.env local ou variável de ambiente no CI).
// Local dev cai no fallback padrão do sandbox.
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgresql://postgres:postgres@127.0.0.1:5432/app_db",
  },
});
