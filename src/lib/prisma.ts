import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const url = process.env.DATABASE_URL;
if (!url) {
  console.warn('Warning: DATABASE_URL is not defined in environment variables');
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: url,
    },
  },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
