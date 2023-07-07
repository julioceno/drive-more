import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '@/users/services/users.service';
import { handleModuleDependencies } from '@/utils';
import { CreateUserDto } from '@/users/services/create-user/dto/create-user.dto';
import { mockUsersService } from '@/utils/mocks/services/users';
import { FindAllUsersDto } from '@/users/services/find-all-users/dto/find-all-users.dto';
import { UpdateUserDto } from '@/users/services/update-user/dto/update-user.dto';

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

  it('should invoke findAll method from UsersController', async () => {
    await controller.findAll({} as FindAllUsersDto);
    expect(mockUsersService.findAll).toHaveBeenLastCalledWith({});
  });

  it('should invoke create method from UsersController', async () => {
    await controller.create({} as CreateUserDto);
    expect(mockUsersService.create).toHaveBeenLastCalledWith({});
  });

  it('should invoke update method from UsersController', async () => {
    await controller.update('', {} as UpdateUserDto);
    expect(mockUsersService.update).toHaveBeenLastCalledWith('', {});
  });

  it('should invoke findOne method from UsersController', async () => {
    await controller.findOne('');
    expect(mockUsersService.findOne).toHaveBeenLastCalledWith('');
  });
});
