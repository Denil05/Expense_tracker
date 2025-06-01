import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

const globalForPrisma = globalThis;

export const db = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

//globalForPrisma.prisma: This global variable ensures that the Prisma Client instance is reused after hot reloads during development. 
// witout this,each time your application reloads, a new instance of the prisma client would be created, potentially leading to connection issues.