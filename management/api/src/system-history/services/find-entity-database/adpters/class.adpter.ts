import { Category, Class, Instructor, Prisma, Student } from '@prisma/client';

interface AdaptProps extends Class {
  category: Category;
  instructor: Instructor;
  student: Student;
}

export class ClassAdpter {
  adapt(classRecord: AdaptProps) {
    const response = {
      'Identificador Técnico': classRecord.id,
      Código: classRecord.code,

      'Data Início da Aula': classRecord.startAt,
      'Data Término da Aula': classRecord.endAt,

      Instrutor: classRecord.instructor.name,
      Aluno: classRecord.student.name,
      Categoria: classRecord.category.acronym,

      'Data de Criação': classRecord.createdAt,
    };

    return response;
  }
}
