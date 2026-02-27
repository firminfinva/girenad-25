import { defineConfig, env } from "prisma/config";
import { config } from "dotenv";

// Load `.env` when running Prisma commands locally
config();

export default defineConfig({
  // path to your schema relative to project root
  schema: "prisma/schema.prisma",
  datasource: {
    // connection URL for migrations and introspection
    url: env("DATABASE_URL"),
  },
});

