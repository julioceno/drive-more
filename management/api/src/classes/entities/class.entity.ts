import { Class } from '@prisma/client';

export class ClassEntity {
  id: string;
  code: number;
  categoryId: string;
  instructorId: string;
  studentId: string;

  startAt: Date;
  endAt: Date;

  constructor(classRecord: Class) {
    this.id = classRecord.id;
    this.code = classRecord.code;
    this.categoryId = classRecord.categoryId;
    this.instructorId = classRecord.instructorId;
    this.studentId = classRecord.studentId;
    this.startAt = classRecord.startAt;
    this.endAt = classRecord.endAt;
  }
}
