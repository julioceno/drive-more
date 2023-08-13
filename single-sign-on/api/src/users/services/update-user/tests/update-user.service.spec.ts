import { Test, TestingModule } from '@nestjs/testing';
import { UpdateUserService } from '../update-user.service';
import { handleModuleDependencies, mockPrismaService } from '@/utils';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserEntity } from '@/users/entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UpdateUserService', () => {
  let service: UpdateUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdateUserService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    service = module.get<UpdateUserService>(UpdateUserService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return updated user instance of UserEntity', async () => {
    const dto = {} as UpdateUserDto;
    const id = '4a5c04ea-afc6-4faa-9782-b59a0e148b57';

    mockPrismaService.user.findUnique.mockResolvedValueOnce({ id });
    mockPrismaService.user.update.mockResolvedValueOnce({ id });

    const response = await service.run(id, dto);

    expect(response).toBeDefined();
    expect(response).toBeInstanceOf(UserEntity);
  });

  it('should invoke prismaService and call findUnique and update from user', async () => {
    const dto = {} as UpdateUserDto;
    const id = '4a5c04ea-afc6-4faa-9782-b59a0e148b57';

    mockPrismaService.user.findUnique.mockResolvedValueOnce({ id });
    mockPrismaService.user.update.mockResolvedValueOnce({ id });

    await service.run(id, dto);

    expect(mockPrismaService.user.findUnique).toHaveBeenLastCalledWith({
      where: {
        id,
      },
    });
    expect(mockPrismaService.user.update).toHaveBeenLastCalledWith({
      data: {
        email: undefined,
        name: undefined,
      },
      where: {
        id,
      },
    });
  });

  it('should throw NotFoundException when user not exists', async () => {
    const dto = {} as UpdateUserDto;
    const id = '4a5c04ea-afc6-4faa-9782-b59a0e148b57';

    mockPrismaService.user.findUnique.mockResolvedValueOnce(null);

    let error = null;
    try {
      await service.run(id, dto);
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(NotFoundException);
    expect(error.message).toBe('Usuário não existe.');
  });
});
