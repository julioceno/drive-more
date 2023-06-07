import { User } from '@prisma/client';

export class UserEntity {
  id: string;
  email: string;
  name: string;
  password: string;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    this.password = user.password;
  }
}
