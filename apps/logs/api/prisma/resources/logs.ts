import { Prisma } from 'prisma/types/client';
import { prisma } from '../seed';

const data: Prisma.LogCreateManyInput[] = [
  {
    id: '9218d387-01af-4755-8a13-a7f13b79a753',
  },
];

export async function logs() {
  const { count } = await prisma.log.createMany({
    data,
    skipDuplicates: true,
  });

  console.log(`${count} logs createds 🚀`);
}
