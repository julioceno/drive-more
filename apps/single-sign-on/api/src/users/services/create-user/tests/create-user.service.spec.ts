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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create user', async () => {
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
    expect(response).toEqual({
      id: 'a9f598b9-5008-4cfa-a58e-e469d925ee6a',
      email: 'julio@dirigirmore.com',
      name: 'julio',
      password: expect.any(String),
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
