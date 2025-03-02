import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const globalForPrisma = global as unknown as { prisma: typeof prisma }

if (process.env.NEXT_PUBLIC_NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma