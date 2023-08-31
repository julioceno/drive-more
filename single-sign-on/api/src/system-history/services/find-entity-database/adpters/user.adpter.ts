import { User } from '@prisma/client';

export class UserAdpter {
  adapt(values: User) {
    return values;
  }
}
