import { Instructor } from '@prisma/client';

export class InstructorAdpter {
  adapt(instructor: Instructor) {
    return instructor;
  }
}
