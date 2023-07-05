import { handleModuleDependencies, mockPrismaService } from '@/utils';
import { DeleteUserService } from '../delete-user.service';
import { TestingModule, Test } from '@nestjs/testing';
import { UserEntity } from '@/users/entities/user.entity';

describe('DeleteUserService', () => {
  let service: DeleteUserService;

  const id = 'mock.id';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeleteUserService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    service = module.get<DeleteUserService>(DeleteUserService);
  });

  mockPrismaService.user.delete.mockResolvedValue({});

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should invoke prismaService and call delete from user', async () => {
    await service.run(id);

    expect(mockPrismaService.user.delete).toHaveBeenLastCalledWith({
      where: {
        id: 'mock.id',
      },
    });
  });

  it('should return entity deleted in instance of UserEntity', async () => {
    const response = await service.run(id);

    expect(response).toBeDefined();
    expect(response).toBeInstanceOf(UserEntity);
  });
});
