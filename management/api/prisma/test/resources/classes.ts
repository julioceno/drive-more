import { Prisma } from '@prisma/client';
import { prisma } from '../seed';
import { addDays, addHours, subDays } from 'date-fns';

const data: Prisma.ClassCreateManyInput[] = [
  {
    id: '27c6c025-7472-4afc-ad68-29593fdf7fa1',

    categoryId: 'b21f11a0-da0d-46c4-941f-288b7ee5a31d',
    instructorId: '0a947644-3bca-4a43-807d-4382c8600167',
    studentId: '4eb29d16-081f-4066-a758-64113a140950',

    startAt: subDays(new Date(), 1),
    endAt: addHours(subDays(new Date(), 1), 2),
  },
  {
    id: '62e7610b-d714-4e70-b45d-8ef40a487b6d',

    categoryId: 'b21f11a0-da0d-46c4-941f-288b7ee5a31d',
    instructorId: '0a947644-3bca-4a43-807d-4382c8600167',
    studentId: '4eb29d16-081f-4066-a758-64113a140950',

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
