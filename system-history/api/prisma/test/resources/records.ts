import { Action, Prisma } from '@prisma/client';
import { prisma } from '../seed';

const data: Prisma.RecordCreateManyInput[] = [
  {
    id: '73e9a386-0cf8-4de1-8dd2-5cd40983cc70',
    codigo: 1,
    action: Action.CREATE,
    creatorEmail: 'user@dirigir.more.com',
    entityId: '1',
    payload: {
      'nOME A': 'A',
    },
    resourceId: '9218d387-01af-4755-8a13-a7f13b79a753', // USERS
  },
];

export async function records() {
  const { count } = await prisma.record.createMany({
    data,
    skipDuplicates: true,
  });

  console.log(`${count} records createds 🚀`);
}
