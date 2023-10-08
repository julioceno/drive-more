import { Student } from '@prisma/client';

export class StudentAdpter {
  adapt(student: Student) {
    const response = {
      'Identificador Técnico': student.id,
      Código: student.code,
      Nome: student.name,
      CPF: student.cpf,
      'Data de Criação': student.createdAt,
      'Data de Atualização': student.updatedAt,
    };

    return response;
  }
}
