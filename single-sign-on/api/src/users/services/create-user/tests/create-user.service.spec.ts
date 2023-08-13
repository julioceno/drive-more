import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { CreateUserService } from '../create-user.service';
import { handleModuleDependencies, mockPrismaService } from '@/utils';
import { CreateUserDto } from '../dto/create-user.dto';
import { CreatedUserEntity } from '@/users/entities/created-user.entity';

describe('CreateUserService', () => {
  let service: CreateUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateUserService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    service = module.get<CreateUserService>(CreateUserService);
  });

  mockPrismaService.role.findUniqueOrThrow.mockResolvedValue({
    id: '475273c1-47e0-4998-9e15-2db9be99e631',
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create user and return in instance CreatedUserEntity', async () => {
    const dto: CreateUserDto = {
      email: 'julio@dirigirmore.com',
      name: 'julio',
    };

    mockPrismaService.user.create.mockResolvedValueOnce({
      id: 'a9f598b9-5008-4cfa-a58e-e469d925ee6a',
      email: 'julio@dirigirmore.com',
      name: 'julio',
    });

    const response = await service.run(dto);

    expect(response).toBeInstanceOf(CreatedUserEntity);
  });

  it('should invoke prismaService and call create from user and findUniqueOrThrow from role', async () => {
    const dto: CreateUserDto = {
      email: 'julio@dirigirmore.com',
      name: 'julio',
    };

    mockPrismaService.user.create.mockResolvedValueOnce({
      id: 'a9f598b9-5008-4cfa-a58e-e469d925ee6a',
      email: 'julio@dirigirmore.com',
      name: 'julio',
    });

    mockPrismaService.role.findUniqueOrThrow.mockResolvedValueOnce({
      id: 'b08b4171-208e-4798-ac11-6bd545b90fc2',
    });

    await service.run(dto);

    expect(mockPrismaService.role.findUniqueOrThrow).toHaveBeenLastCalledWith({
      where: {
        name: 'USER',
      },
    });

    expect(mockPrismaService.user.create).toHaveBeenLastCalledWith({
      data: {
        email: 'julio@dirigirmore.com',
        name: 'julio',
        password: expect.anything(),
        roleId: 'b08b4171-208e-4798-ac11-6bd545b90fc2',
      },
    });
  });

  it('should return throw BadRequestException when user already exists', async () => {
    const dto: CreateUserDto = {
      email: 'julio@dirigirmore.com',
      name: 'julio',
    };

    mockPrismaService.user.findUnique.mockResolvedValueOnce({
      id: 'a9f598b9-5008-4cfa-a58e-e469d925ee6a',
    });

    mockPrismaService.user.create.mockResolvedValueOnce({
      id: 'a9f598b9-5008-4cfa-a58e-e469d925ee6a',
      email: 'julio@dirigirmore.com',
      name: 'julio',
    });

    let error = null;

    try {
      await service.run(dto);
    } catch (err) {
      error = err;
    }

    expect(error).toBeInstanceOf(BadRequestException);
    expect(error.message).toBe('Usuário já existe.');
  });
});
