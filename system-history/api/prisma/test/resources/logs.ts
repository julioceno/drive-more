import { Prisma } from '@prisma/client';
import { prisma } from '../seed';

const data: Prisma.ResourceCreateManyInput[] = [
  {
    id: '9218d387-01af-4755-8a13-a7f13b79a753',
  },
] as any;

export async function resources() {
  const { count } = await prisma.resource.createMany({
    data,
    skipDuplicates: true,
  });

  console.log(`${count} resources createds 🚀`);
}
