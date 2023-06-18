import { Prisma } from '@prisma/client';
import { prisma } from '../seed';

const data: Prisma.UserCreateManyInput[] = [
  {
    id: '5bc51e9a-056b-4859-b90f-51995dbce2d0',
    name: 'Admin',
    email: 'admin@dirigir.more.com',
    password: '$2b$08$hQexMg7jWW63kdp/lXLH8.o/ldXaFqggj8zSKpdU3Cahswd7BAwk2',
    roleId: '095fca1c-f659-49e7-a2b9-3854a17b222e', // ROLE ADMIN
  },
  {
    id: '92ab7ca5-f68a-4723-8a5f-efad6caaf257',
    name: 'User',
    email: 'user@dirigir.more.com',
    password: '$2b$08$ZqYGiCxwNBKUVlcJ.vD0vuqMW9cNgrWDW.339ExcyBRia570uVHLe',
    roleId: '461ef119-3d2d-42ef-acfd-ba469db9bea1', // ROLE ADMIN
  },
];

export async function users() {
  const { count } = await prisma.user.createMany({
    data,
    skipDuplicates: true,
  });

  console.log(`${count} users createds 🚀`);
}
