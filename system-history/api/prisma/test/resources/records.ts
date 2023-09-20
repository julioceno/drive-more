import { Action, Prisma } from '@prisma/client';
import { prisma } from '../seed';

const data: Prisma.RecordCreateManyInput[] = [
  {
    id: '73e9a386-0cf8-4de1-8dd2-5cd40983cc70',
    action: Action.CREATE,
    creatorEmail: 'user@dirigir.more.com',
    entityId: '1',
    payload: {
      'Identificador Técnico': '2929c915-acaf-4773-aaad-caa67c1f8bbd',
      Código: 21,
      Nome: 'test',
      Email: 'email@dirigir.more.com',
      Papel: 'Usuário',
      'Data de Criação': '2023-09-09T16:14:23.842Z',
      'Data de Atualização': '2023-09-09T16:14:23.842Z',
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
