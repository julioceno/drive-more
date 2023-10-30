import { Category, Class, Instructor, Student } from '@prisma/client';
import { formatInTimeZone } from 'date-fns-tz';

interface AdaptProps extends Class {
  category: Category;
  instructor: Instructor;
}

export class ClassAdpter {
  timeZone: string;

  constructor(timeZone: string) {
    this.timeZone = timeZone;
  }

  adapt(classRecord: AdaptProps) {
    const instructorName = classRecord.instructor.name;
    const category = classRecord.category.acronym;

    const startAt = this.formatDate(classRecord.startAt);
    const endAt = this.formatDate(classRecord.endAt);

    return { instructorName, category, startAt, endAt };
  }

  private formatDate(date: Date) {
    return formatInTimeZone(date, this.timeZone, 'dd/MM/yyyy - HH:mm');
  }
}
