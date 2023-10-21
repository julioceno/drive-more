import { Test, TestingModule } from '@nestjs/testing';
import { handleModuleDependencies } from '@/utils';
import { UsersService } from '../users.service';
import {
  mockChangeRoleUserService,
  mockCreateUserService,
  mockDeleteUserService,
  mockFindAllUsersService,
  mockFindOneUserService,
  mockUpdatePasswordUserService,
  mockUpdateUserService,
} from '@/utils/mocks/services/users';
import { CreateUserDto } from '../create-user/dto/create-user.dto';
import { UpdateUserDto } from '../update-user/dto/update-user.dto';
import { UpdatePasswordUserDto } from '../update-password-user/dto/update-password-user.dto';
import { ChangeRoleUserDto } from '../change-role-user/dto/change-role-user.dto';

describe('UsersService', () => {
  let service: UsersService;

  const userId = 'mock.userId';
  const creatorEmail = 'mock.creatorEmail';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should invoke create method', async () => {
    await service.create(creatorEmail, {} as CreateUserDto);
    expect(mockCreateUserService.run).toHaveBeenLastCalledWith(
      creatorEmail,
      {},
    );
  });

  it('should invoke findAll method', async () => {
    await service.findAll({} as UpdateUserDto);
    expect(mockFindAllUsersService.run).toHaveBeenLastCalledWith({});
  });

  it('should invoke findOne method', async () => {
    await service.findOne(userId);
    expect(mockFindOneUserService.run).toHaveBeenLastCalledWith(userId);
  });

  it('should invoke update method', async () => {
    await service.update(userId, {} as UpdateUserDto);
    expect(mockUpdateUserService.run).toHaveBeenLastCalledWith(userId, {});
  });

  it('should invoke updatePassword method', async () => {
    await service.updatePassword(userId, {} as UpdatePasswordUserDto);
    expect(mockUpdatePasswordUserService.run).toHaveBeenLastCalledWith(
      userId,
      {},
    );
  });

  it('should invoke delete method', async () => {
    await service.delete(userId, creatorEmail);
    expect(mockDeleteUserService.run).toHaveBeenLastCalledWith(
      userId,
      creatorEmail,
    );
  });

  it('should invoke changeRole method', async () => {
    await service.changeRole(creatorEmail, {} as ChangeRoleUserDto);
    expect(mockChangeRoleUserService.run).toHaveBeenLastCalledWith(
      creatorEmail,
      {},
    );
  });
});
