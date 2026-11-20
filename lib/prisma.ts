import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// Handle Vercel / AWS Lambda Serverless environment
if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
  const tmpDbPath = '/tmp/coy.db';
  if (!fs.existsSync(tmpDbPath)) {
    // Look for bundled seed.db in project paths
    const possibleSeedPaths = [
      path.join(process.cwd(), 'prisma', 'seed.db'),
      path.join(__dirname, '..', '..', 'prisma', 'seed.db'),
      path.join('/var/task', 'prisma', 'seed.db'),
      path.resolve('./prisma/seed.db'),
    ];

    let copied = false;
    for (const seedPath of possibleSeedPaths) {
      if (fs.existsSync(seedPath)) {
        try {
          fs.copyFileSync(seedPath, tmpDbPath);
          copied = true;
          break;
        } catch (e) {
          console.error(`Failed to copy seed db from ${seedPath}:`, e);
        }
      }
    }

    if (!copied) {
      console.warn('Could not find seed.db template, initializing empty database in /tmp');
    }
  }

  process.env.DATABASE_URL = `file:${tmpDbPath}`;
} else if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db';
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
