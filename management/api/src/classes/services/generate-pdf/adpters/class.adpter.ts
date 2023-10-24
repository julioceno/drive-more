import { Category, Class, Instructor, Student } from '@prisma/client';

interface AdaptProps extends Class {
  category: Category;
  instructor: Instructor;
}

export class ClassAdpter {
  adapt(classRecord: AdaptProps) {
    const instructorName = classRecord.instructor.name;
    const category = classRecord.category.acronym;

    const startAt = classRecord.startAt;
    const endAt = classRecord.endAt;

    return { instructorName, category, startAt, endAt };
  }
}
