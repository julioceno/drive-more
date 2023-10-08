import { Instructor } from '@prisma/client';

export class InstructorAdpter {
  adapt(instructor: Instructor) {
    const response = {
      'Identificador Técnico': instructor.id,
      Código: instructor.code,
      Nome: instructor.name,
      CPF: instructor.cpf,
      'Data de Criação': instructor.createdAt,
      'Data de Atualização': instructor.updatedAt,
    };

    return response;
  }
}
