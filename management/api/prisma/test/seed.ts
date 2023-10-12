import { PrismaClient } from '@prisma/client';
import { categories, instructors, students } from './resources';

export const prisma = new PrismaClient();

async function main() {
  await categories();
  await instructors();
  await students();
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
