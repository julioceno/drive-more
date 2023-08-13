import { roles, users } from './resources';
import { PrismaClient } from './types/client';

export const prisma = new PrismaClient();

async function main() {
  await roles();
  await users();
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
