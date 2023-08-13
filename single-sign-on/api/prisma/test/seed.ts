import { PrismaClient } from '@prisma/client';
import { refreshTokens, roles, users } from './resources';

export const prisma = new PrismaClient();

async function main() {
  await roles();
  await users();
  await refreshTokens();
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
