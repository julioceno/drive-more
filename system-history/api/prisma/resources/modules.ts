import { Prisma } from '@prisma/client';
import { prisma } from '../seed';

const data: Prisma.ModuleCreateManyInput[] = [
  {
    id: '0d181ee0-08b2-4aa6-affd-39282b4ad7c4',
    name: 'Single Sign On',
  },
];

export async function modules() {
  const { count } = await prisma.module.createMany({
    data,
    skipDuplicates: true,
  });

  console.log(`${count} modules createds 🚀`);
}
