import { RoleEnum } from '@/common';
import { Role, User } from '@prisma/client';

interface AdaptProps extends User {
  role?: Role;
}

export class UserAdpter {
  adapt(user: AdaptProps) {
    const roleEnum = user.role.name;
    let role = undefined;

    if (user.role?.id) {
      role =
        roleEnum === RoleEnum.USER
          ? 'Usuário'
          : roleEnum === RoleEnum.ADMIN
          ? 'Administrador'
          : undefined;
    }

    const response = {
      'Identificador Técnico': user.id,
      Código: user.codigo,
      Nome: user.name,
      Email: user.email,
      Papel: role,
      'Data de Criação': user.createdAt,
      'Data de Atualização': user.updatedAt,
    };

    return response;
  }
}
