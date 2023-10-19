import { Prisma } from '@prisma/client';
import { prisma } from '../seed';
import { addDays, addHours, subDays } from 'date-fns';

const data: Prisma.ClassCreateManyInput[] = [
  {
    id: '27c6c025-7472-4afc-ad68-29593fdf7fa1',

    categoryId: 'b21f11a0-da0d-46c4-941f-288b7ee5a31d',
    studentId: '70262a58-c48c-440e-bd00-33dc849dfd0d',
    instructorId: 'b4a0aa0a-ff61-4e72-8551-26942cea858d',

    startAt: subDays(new Date(), 1),
    endAt: addHours(subDays(new Date(), 1), 2),
  },
  {
    id: '62e7610b-d714-4e70-b45d-8ef40a487b6d',

    categoryId: 'b21f11a0-da0d-46c4-941f-288b7ee5a31d',
    studentId: '70262a58-c48c-440e-bd00-33dc849dfd0d',
    instructorId: 'b4a0aa0a-ff61-4e72-8551-26942cea858d',

    startAt: addDays(new Date(), 1),
    endAt: addHours(addDays(new Date(), 1), 2),
  },
];

export async function classes() {
  const { count } = await prisma.class.createMany({
    data,
    skipDuplicates: true,
  });

  console.log(`${count} classes createds 🚀`);
}
