import { Prisma } from '@prisma/client';
import { prisma } from '../seed';

const data: Prisma.ResourceCreateManyInput[] = [
  {
    id: '9218d387-01af-4755-8a13-a7f13b79a753',
    code: 1,
    name: 'USERS',
    moduleId: '4808b940-ce13-4c34-9202-6e1d275184d2', // SINGLE SING ON
  },
];

export async function resources() {
  const { count } = await prisma.resource.createMany({
    data,
    skipDuplicates: true,
  });

  console.log(`${count} resources createds 🚀`);
}
