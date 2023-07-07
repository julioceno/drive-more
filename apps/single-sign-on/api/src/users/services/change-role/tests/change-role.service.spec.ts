import { handleModuleDependencies, mockPrismaService } from '@/utils';
import { ChangeRoleService } from '../change-role.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '../utils';
import { ChangeRoleDto } from '../dto/change-role.dto';
import { UserEntity } from '@/users/entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('ChangeRoleService', () => {
  let service: ChangeRoleService;

  const userId = 'mock.userId';

  const dto: ChangeRoleDto = { userId, role: Role.USER };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChangeRoleService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    service = module.get<ChangeRoleService>(ChangeRoleService);
  });

  mockPrismaService.user.findUnique.mockResolvedValue({ id: userId });

  mockPrismaService.role.findUnique.mockResolvedValue({ id: 'mock.roleId' });

  mockPrismaService.user.update.mockResolvedValue({
    id: userId,
    role: { name: Role.USER },
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return updated user instance of UserEntity', async () => {
    const response = await service.run(dto);

    expect(mockPrismaService.user.update).toHaveBeenLastCalledWith({
      data: {
        role: {
          connect: {
            name: Role.USER,
          },
        },
      },
      include: {
        role: true,
      },
      where: {
        id: userId,
      },
    });

    expect(response).toBeDefined();
    expect(response).toBeInstanceOf(UserEntity);
  });

  it('should throw NotFoundException when user not exists', async () => {
    mockPrismaService.user.findUnique.mockResolvedValue(null);

    let error = null;

    try {
      await service.run(dto);
    } catch (err) {
      error = err;
    }

    expect(mockPrismaService.user.findUnique).toHaveBeenLastCalledWith({
      where: {
        id: userId,
      },
    });

    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(NotFoundException);
    expect(error.message).toBe('Usuário não encontrado.');
  });
  it('should throw NotFoundException when role not exists', async () => {
    mockPrismaService.role.findUnique.mockResolvedValue(null);

    let error = null;

    try {
      await service.run(dto);
    } catch (err) {
      error = err;
    }

    expect(mockPrismaService.role.findUnique).toHaveBeenLastCalledWith({
      where: {
        name: Role.USER,
      },
    });

    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(NotFoundException);
    expect(error.message).toBe('Role não encontrada.');
  });
});
