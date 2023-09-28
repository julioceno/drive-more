import { Prisma } from '@prisma/client';
import { prisma } from '../seed';

const data: Prisma.CategoryCreateManyInput[] = [
  {
    id: '233d6dc4-74a4-4f3e-a3ec-751217394a70',
    code: 1,
    acronym: 'A',
  },
  {
    id: '42c10b95-c52f-401a-9e9c-b440a33b075d',
    code: 2,
    acronym: 'B',
  },
  {
    id: '6a2bd123-15fe-4443-b11f-6f217fde666e',
    code: 3,
    acronym: 'C',
  },
];

export async function categories() {
  const { count } = await prisma.category.createMany({
    data,
    skipDuplicates: true,
  });

  console.log(`${count} categories createds 🚀`);
}
