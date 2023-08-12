import { Role, User } from 'prisma/types/client';

interface UserConstructorProps extends User {
  role?: Role;
}

export class UserEntity {
  id: string;
  email: string;
  name: string;

  role: string;

  constructor({ role, ...user }: UserConstructorProps) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;

    this.role = role?.name ?? undefined;
  }
}
