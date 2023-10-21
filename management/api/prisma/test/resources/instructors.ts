import { Prisma } from '@prisma/client';
import { prisma } from '../seed';

const data: Prisma.InstructorCreateManyInput[] = [
  {
    id: 'b4a0aa0a-ff61-4e72-8551-26942cea858d',
    cpf: '572.249.396-17',
    name: 'Instructor 1',
  },
  {
    id: '04a6982e-ffa5-4040-b7bd-2400ae67a46f',
    cpf: '185.174.817-20',
    name: 'Instructor 2',
  },
  {
    id: '0a947644-3bca-4a43-807d-4382c8600167',
    cpf: '400.007.853-42',
    name: 'Instructor 3',
  },
];

export async function instructors() {
  const { count } = await prisma.instructor.createMany({
    data,
    skipDuplicates: true,
  });

  console.log(`${count} instructors createds 🚀`);
}
