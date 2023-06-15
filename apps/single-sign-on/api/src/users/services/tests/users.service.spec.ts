import { Test, TestingModule } from '@nestjs/testing';
import { handleModuleDependencies } from '@/utils';
import { UsersService } from '../users.service';
import { mockCreateUser } from '@/utils/mocks/services/users';
import { CreateUserDto } from '../create-user/dto/create-user.dto';

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
    expect(mockCreateUser.run).toHaveBeenLastCalledWith({});
  });
});
