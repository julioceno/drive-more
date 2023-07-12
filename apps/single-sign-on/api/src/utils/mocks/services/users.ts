import { ChangeRoleUserService } from '@/users/services/change-role-user/change-role-user.service';
import { CreateUserService } from '@/users/services/create-user/create-user.service';
import { DeleteUserService } from '@/users/services/delete-user/delete-user.service';
import { FindAllUsersService } from '@/users/services/find-all-users/find-all-users.service';
import { FindOneUserService } from '@/users/services/find-one-user/find-one-user.service';
import { UpdatePasswordUserService } from '@/users/services/update-password-user/update-password-user.service';
import { UpdateUserService } from '@/users/services/update-user/update-user.service';
import { UsersService } from '@/users/services/users.service';

export const mockUsersService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  updatePassword: jest.fn(),
  delete: jest.fn(),
  changeRole: jest.fn(),
};

export const mockCreateUserService = {
  run: jest.fn(),
};

export const mockUpdateUserService = {
  run: jest.fn(),
};

export const mockFindOneUserService = {
  run: jest.fn(),
};

export const mockFindAllUsersService = {
  run: jest.fn(),
};

export const mockDeleteUserService = {
  run: jest.fn(),
};

export const mockUpdatePasswordUserService = {
  run: jest.fn(),
};

export const mockChangeRoleUserService = {
  run: jest.fn(),
};

export const usersMocks = [
  {
    provide: UsersService,
    useValue: mockUsersService,
  },
  {
    provide: CreateUserService,
    useValue: mockCreateUserService,
  },
  {
    provide: UpdateUserService,
    useValue: mockUpdateUserService,
  },
  {
    provide: FindOneUserService,
    useValue: mockFindOneUserService,
  },
  {
    provide: FindAllUsersService,
    useValue: mockFindAllUsersService,
  },
  {
    provide: UpdatePasswordUserService,
    useValue: mockUpdatePasswordUserService,
  },
  {
    provide: DeleteUserService,
    useValue: mockDeleteUserService,
  },
  {
    provide: ChangeRoleUserService,
    useValue: mockChangeRoleUserService,
  },
];
