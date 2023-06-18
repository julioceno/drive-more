import { Prisma } from '@prisma/client';
import { prisma } from '../seed';

const data: Prisma.RoleCreateManyInput[] = [
  {
    id: '095fca1c-f659-49e7-a2b9-3854a17b222e',
    name: 'ADMIN',
  },
  {
    id: '461ef119-3d2d-42ef-acfd-ba469db9bea1',
    name: 'USER',
  },
];

export async function roles() {
  const { count } = await prisma.role.createMany({
    data,
    skipDuplicates: true,
  });

  console.log(`${count} roles createds 🚀`);
}
