import { Class } from '@prisma/client';

export class ClassEntity {
  id: string;
  categoryId: string;
  instructorId: string;
  studentId: string;

  startAt: Date;
  endAt: Date;

  constructor(classRecord: Class) {
    this.id = classRecord.id;
    this.categoryId = classRecord.categoryId;
    this.instructorId = classRecord.id;
    this.studentId = classRecord.studentId;
    this.startAt = classRecord.startAt;
    this.endAt = classRecord.endAt;
  }
}
