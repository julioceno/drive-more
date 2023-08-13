import { addMinutes, getUnixTime } from 'date-fns';
import { prisma } from '../seed';
import { Prisma } from '@prisma/client';

const data: Prisma.RefreshTokenCreateManyInput[] = [
  {
    expiresIn: getUnixTime(addMinutes(new Date(), 100)),
    userId: 'fdbe66f2-f31d-4302-bb97-0ff888045292', // admin
  },
];

export async function refreshTokens() {
  const { count } = await prisma.refreshToken.createMany({
    data,
    skipDuplicates: true,
  });

  console.log(`${count} refreshs token createds`);
}
