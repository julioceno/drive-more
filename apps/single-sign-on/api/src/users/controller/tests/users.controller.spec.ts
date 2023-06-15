import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '@/users/services/users.service';
import { handleModuleDependencies } from '@/utils';
import { CreateUserDto } from '@/users/services/create-user/dto/create-user.dto';
import { mockCreateUser } from '@/utils/mocks/services/users';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should invoke create method from UsersController', async () => {
    await controller.create({} as CreateUserDto);
    expect(mockCreateUser.run).toHaveBeenLastCalledWith({});
  });
});
