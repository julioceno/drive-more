import {
  handleModuleDependencies,
  mockPrismaService,
  mockSystemHistoryProxyService,
} from '@/utils';
import { UpdatePasswordUserService } from '../update-password-user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdatePasswordUserDto } from '../dto/update-password-user.dto';
import { UserEntity } from '@/users/entities/user.entity';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ActionEnum } from '@/system-history/interface/system-history.interface';
import { Resources } from '@/common';

describe('UpdatePasswordUserService', () => {
  let service: UpdatePasswordUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdatePasswordUserService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    service = module.get<UpdatePasswordUserService>(UpdatePasswordUserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const id = '4a5c04ea-afc6-4faa-9782-b59a0e148b57';
  const passwordHashed =
    '$2b$08$3NsRYLYqr1e4.N8WyFpswecXKzzLgRFKjUUgKbENvcb7BJ/xBZdo6';
  const email = 'mock.email';

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return updated user instance of UserEntity', async () => {
    const dto: UpdatePasswordUserDto = {
      currentPassword: 'oldPass',
      password: 'pass',
    };

    mockPrismaService.user.findUnique.mockResolvedValueOnce({
      id,
      password: passwordHashed,
    });
    mockPrismaService.user.update.mockResolvedValueOnce({ id });

    const response = await service.run(id, dto);

    expect(response).toBeDefined();
    expect(response).toBeInstanceOf(UserEntity);
  });

  it('should invoke prismaService and call findUnique and update from user', async () => {
    const dto: UpdatePasswordUserDto = {
      currentPassword: 'oldPass',
      password: 'pass',
    };
    const id = '4a5c04ea-afc6-4faa-9782-b59a0e148b57';

    mockPrismaService.user.findUnique.mockResolvedValueOnce({
      id,
      password: passwordHashed,
    });
    mockPrismaService.user.update.mockResolvedValueOnce({ id });

    await service.run(id, dto);

    expect(mockPrismaService.user.findUnique).toHaveBeenLastCalledWith({
      where: {
        id,
      },
    });
    expect(mockPrismaService.user.update).toHaveBeenLastCalledWith({
      data: {
        password: expect.any(String),
      },
      where: {
        id,
      },
    });
  });

  it('should throw NotFoundException when user not exists', async () => {
    const dto = {} as UpdatePasswordUserDto;
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

  it('should throw UnauthorizedException when currentPassword is incorrect', async () => {
    const dto: UpdatePasswordUserDto = {
      currentPassword: 'oldPass',
      password: 'pass',
    };
    const id = '4a5c04ea-afc6-4faa-9782-b59a0e148b57';

    mockPrismaService.user.findUnique.mockResolvedValueOnce({
      id,
      password: 'incorrect password',
    });

    let error = null;
    try {
      await service.run(id, dto);
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(UnauthorizedException);
  });

  it('should invoke SystemHistoryProxyService and call createRecordCustom method', async () => {
    const dto: UpdatePasswordUserDto = {
      currentPassword: 'oldPass',
      password: 'pass',
    };

    mockPrismaService.user.findUnique.mockResolvedValueOnce({
      id,
      password: passwordHashed,
    });
    mockPrismaService.user.update.mockResolvedValueOnce({ id, email });

    await service.run(id, dto);

    expect(
      mockSystemHistoryProxyService.createRecordCustom,
    ).toHaveBeenLastCalledWith({
      action: ActionEnum.UPDATE,
      creatorEmail: email,
      entityId: undefined,
      payload: 'Password from user mock.email is modified',
      resourceName: Resources.USER,
    });
  });
});
