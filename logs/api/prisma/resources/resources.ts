import { Prisma } from '@prisma/client';
import { prisma } from '../seed';

const data: Prisma.ResourceCreateManyInput[] = [
  {
    id: '0d181ee0-08b2-4aa6-affd-39282b4ad7c4',
    name: 'Single Sign On',
    moduleId: '0d181ee0-08b2-4aa6-affd-39282b4ad7c4', // Single Sign On
  },
];

export async function resources() {
  const { count } = await prisma.resource.createMany({
    data,
    skipDuplicates: true,
  });

  console.log(`${count} resources createds 🚀`);
}
