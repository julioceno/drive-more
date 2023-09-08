import { Action, Prisma } from '@prisma/client';
import { prisma } from '../seed';

const data: Prisma.ResourceCreateManyInput[] = [
  /*  {
    id: '9218d387-01af-4755-8a13-a7f13b79a753',
    action: Action.CREATE,
    entityId: 'de09bacc-ad3c-4766-9034-d9ff576e6460',
    resourceId: '0508d45d-d5ee-4270-844e-9183d2bbbadb',
    payload: '',
    creatorEmail: 'admin@dirigir.more.com',
  }, */
];

export async function records() {
  const { count } = await prisma.resource.createMany({
    data,
    skipDuplicates: true,
  });

  console.log(`${count} records createds 🚀`);
}
