import { PrismaClient } from '@prisma/client';
import { roles } from './resources';

export const prisma = new PrismaClient();

async function main() {
  await roles();
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
