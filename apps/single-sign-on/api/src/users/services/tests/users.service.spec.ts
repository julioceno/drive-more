import { Test, TestingModule } from '@nestjs/testing';
import { handleModuleDependencies } from '@/utils';
import { UsersService } from '../users.service';
import {
  mockChangeRoleService,
  mockCreateUserService,
  mockDeleteUserService,
  mockFindAllUsersService,
  mockFindOneUserService,
  mockUpdatePasswordUserService,
  mockUpdateUserService,
} from '@/utils/mocks/services/users';
import { CreateUserDto } from '../create-user/dto/create-user.dto';
import { UpdateUserDto } from '../update-user/dto/update-user.dto';
import { ChangeRoleDto } from '../change-role/dto/change-role.dto';
import { UpdatePasswordUserDto } from '../update-password-user/dto/update-password-user.dto';

describe('UsersService', () => {
  let service: UsersService;

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
    await service.create({} as CreateUserDto);
    expect(mockCreateUserService.run).toHaveBeenLastCalledWith({});
  });

  it('should invoke findAll method', async () => {
    await service.findAll({} as UpdateUserDto);
    expect(mockFindAllUsersService.run).toHaveBeenLastCalledWith({});
  });

  it('should invoke findOne method', async () => {
    await service.findOne('');
    expect(mockFindOneUserService.run).toHaveBeenLastCalledWith('');
  });

  it('should invoke update method', async () => {
    await service.update('', {} as UpdateUserDto);
    expect(mockUpdateUserService.run).toHaveBeenLastCalledWith('', {});
  });

  it('should invoke updatePassword method', async () => {
    await service.updatePassword('', {} as UpdatePasswordUserDto);
    expect(mockUpdatePasswordUserService.run).toHaveBeenLastCalledWith('', {});
  });

  it('should invoke delete method', async () => {
    await service.delete('');
    expect(mockDeleteUserService.run).toHaveBeenLastCalledWith('');
  });

  it('should invoke changeRole method', async () => {
    await service.changeRole({} as ChangeRoleDto);
    expect(mockChangeRoleService.run).toHaveBeenLastCalledWith({});
  });
});
