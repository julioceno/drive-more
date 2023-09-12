import { Prisma } from '@prisma/client';
import { prisma } from '../seed';

const data: Prisma.ModuleCreateManyInput[] = [
  {
    id: '4808b940-ce13-4c34-9202-6e1d275184d2',
    code: 1,
    name: 'SINGLE SING ON',
  },
];

export async function modules() {
  const { count } = await prisma.module.createMany({
    data,
    skipDuplicates: true,
  });

  console.log(`${count} modules createds 🚀`);
}
