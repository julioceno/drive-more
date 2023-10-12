import { Prisma } from '@prisma/client';
import { prisma } from '../seed';

const data: Prisma.StudentCreateManyInput[] = [
  {
    id: '70262a58-c48c-440e-bd00-33dc849dfd0d',
    cpf: '892.175.779-10',
    name: 'Student 1',
  },
  {
    id: '491d119d-b879-4689-9128-6321062e4152',
    cpf: '488.567.780-76',
    name: 'Student 2',
  },
];

export async function students() {
  const { count } = await prisma.student.createMany({
    data,
    skipDuplicates: true,
  });

  console.log(`${count} students createds 🚀`);
}
