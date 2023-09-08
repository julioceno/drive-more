import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from '@/common';

export const ROLE_KEY = 'role';

export const Role = (role: RoleEnum) => SetMetadata(ROLE_KEY, role);
