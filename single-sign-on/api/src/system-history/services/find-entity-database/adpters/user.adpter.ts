import { Role, User } from '@prisma/client';

interface AdaptProps extends User {
  role?: Role;
}

export class UserAdpter {
  adapt(user: AdaptProps) {
    const values: any = user;

    delete values.role;
    delete values.password;

    if (user.role?.id) {
      values.role = `${user.role.name}`;
    }

    return values;
  }
}
