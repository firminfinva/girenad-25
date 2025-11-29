import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "La variable d'environnement DATABASE_URL est manquante. Veuillez la définir dans votre fichier .env."
  );
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

// Force reload Prisma client in development to pick up new models
if (process.env.NODE_ENV !== "production" && globalForPrisma.prisma) {
  // Clear the cached instance to force reload
  delete (globalForPrisma as any).prisma;
}

const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;

