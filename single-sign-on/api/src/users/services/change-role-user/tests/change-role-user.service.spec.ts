import {
  handleModuleDependencies,
  mockPrismaService,
  mockSystemHistoryProxyService,
} from '@/utils';
import { Test, TestingModule } from '@nestjs/testing';

import { UserEntity } from '@/users/entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { ChangeRoleUserService } from '../change-role-user.service';
import { ChangeRoleUserDto } from '../dto/change-role-user.dto';
import { Resources, RoleEnum } from '@/common';
import { ActionEnum } from '@/system-history/interface/system-history.interface';

describe('ChangeRoleUserService', () => {
  let service: ChangeRoleUserService;

  const userId = 'mock.userId';
  const creatorEmail = 'mock.creatorEmail';
  const email = 'mock.email';

  const dto: ChangeRoleUserDto = { userId, role: RoleEnum.USER };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChangeRoleUserService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    service = module.get<ChangeRoleUserService>(ChangeRoleUserService);

    mockPrismaService.user.findUnique.mockResolvedValue({ id: userId });

    mockPrismaService.role.findUnique.mockResolvedValue({ id: 'mock.roleId' });

    mockPrismaService.user.update.mockResolvedValue({
      id: userId,
      email,
      role: { name: RoleEnum.USER },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return updated user instance of UserEntity', async () => {
    const response = await service.run(creatorEmail, dto);

    expect(mockPrismaService.user.update).toHaveBeenLastCalledWith({
      data: {
        role: {
          connect: {
            name: RoleEnum.USER,
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
      await service.run(creatorEmail, dto);
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
      await service.run(creatorEmail, dto);
    } catch (err) {
      error = err;
    }

    expect(mockPrismaService.role.findUnique).toHaveBeenLastCalledWith({
      where: {
        name: RoleEnum.USER,
      },
    });

    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(NotFoundException);
    expect(error.message).toBe('Role não encontrada.');
  });

  it('should invoke SystemHistoryProxyService and call createRecordStandard method', async () => {
    await service.run(creatorEmail, dto);

    expect(
      mockSystemHistoryProxyService.createRecordStandard,
    ).toHaveBeenLastCalledWith(
      creatorEmail,
      ActionEnum.UPDATE,
      {
        id: userId,
        email,
        role: {
          name: RoleEnum.USER,
        },
      },
      Resources.USER,
    );
  });
});
