import { Prisma } from '@prisma/client';
import { prisma } from '../seed';

const data: Prisma.CategoryCreateManyInput[] = [
  {
    id: 'b21f11a0-da0d-46c4-941f-288b7ee5a31d',
    code: 1,
    acronym: 'A',
  },
  {
    id: 'e8cf6f86-8e26-4190-b2f7-9eed82e7690b',
    code: 2,
    acronym: 'B',
  },
  {
    id: 'bf73cb7f-6803-4ff7-9120-834ec9ba6969',
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
