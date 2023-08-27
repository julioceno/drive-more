import { Action, Prisma } from '@prisma/client';
import { prisma } from '../seed';

const data: Prisma.LogCreateManyInput[] = [
  {
    id: '9218d387-01af-4755-8a13-a7f13b79a753',
    action: Action.CREATE,
    entityId: 'de09bacc-ad3c-4766-9034-d9ff576e6460',
    resourceId: '0d181ee0-08b2-4aa6-affd-39282b4ad7c4',
    payload: '',
    creatorEmail: 'admin@dirigir.more.com',
  },
];

export async function logs() {
  const { count } = await prisma.log.createMany({
    data,
    skipDuplicates: true,
  });

  console.log(`${count} logs createds 🚀`);
}
