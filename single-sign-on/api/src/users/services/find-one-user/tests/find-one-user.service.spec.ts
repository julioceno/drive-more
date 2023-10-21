import { Test, TestingModule } from '@nestjs/testing';
import { handleModuleDependencies, mockPrismaService } from '../../../../utils';
import { FindOneUserService } from '../find-one-user.service';
import { UserEntity } from '../../../entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('CreateUserService', () => {
  let service: FindOneUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindOneUserService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    service = module.get<FindOneUserService>(FindOneUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get user', async () => {
    const id = 'a9f598b9-5008-4cfa-a58e-e469d925ee6a';

    mockPrismaService.user.findUnique.mockResolvedValue({
      id,
      email: 'julio@drive.more.com',
      name: 'julio',
    });

    const response = await service.run(id);

    expect(response).toBeInstanceOf(UserEntity);
    expect(mockPrismaService.user.findUnique).toHaveBeenLastCalledWith({
      where: { id },
    });
  });

  it('should return throw NotFoundException when user not exists', async () => {
    const id = 'a9f598b9-5008-4cfa-a58e-e469d925ee6a';

    mockPrismaService.user.findUnique.mockResolvedValue(null);

    let error = null;
    try {
      await service.run(id);
    } catch (err) {
      error = err;
    }

    expect(error).toBeInstanceOf(NotFoundException);
    expect(error.message).toBe('Recurso buscado impossível de ser encontrado.');
  });
});
