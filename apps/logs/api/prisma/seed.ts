import { logs } from './resources';
import { PrismaClient } from './types/client';

export const prisma = new PrismaClient();

async function main() {
  await logs();
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
