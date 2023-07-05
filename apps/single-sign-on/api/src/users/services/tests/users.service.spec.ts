import { Test, TestingModule } from '@nestjs/testing';
import { handleModuleDependencies } from '@/utils';
import { UsersService } from '../users.service';
import {
  mockCreateUser,
  mockDeleteUser,
  mockFindAllUsers,
  mockFindOneUser,
  mockUpdateUser,
} from '@/utils/mocks/services/users';
import { CreateUserDto } from '../create-user/dto/create-user.dto';
import { UpdateUserDto } from '../update-user/dto/update-user.dto';

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

  it('should invoke findAll method', async () => {
    await service.findAll({} as UpdateUserDto);
    expect(mockFindAllUsers.run).toHaveBeenLastCalledWith({});
  });

  it('should invoke create method', async () => {
    await service.create({} as CreateUserDto);
    expect(mockCreateUser.run).toHaveBeenLastCalledWith({});
  });

  it('should invoke update method', async () => {
    await service.update('', {} as UpdateUserDto);
    expect(mockUpdateUser.run).toHaveBeenLastCalledWith('', {});
  });

  it('should invoke findOne method', async () => {
    await service.findOne('');
    expect(mockFindOneUser.run).toHaveBeenLastCalledWith('');
  });

  it('should invoke delete method', async () => {
    await service.delete('');
    expect(mockDeleteUser.run).toHaveBeenLastCalledWith('');
  });
});
