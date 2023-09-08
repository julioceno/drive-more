import { PrismaClient } from '@prisma/client';
import { resources } from './resources';

export const prisma = new PrismaClient();

async function main() {
  await resources();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
