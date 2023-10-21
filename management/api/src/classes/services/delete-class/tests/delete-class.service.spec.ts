import { Resources } from '@/common';
import { ActionEnum } from '@/system-history/interface/system-history.interface';
import {
  handleModuleDependencies,
  mockPrismaService,
  mockSystemHistoryProxyService,
} from '@/utils';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { subDays } from 'date-fns';
import { DeleteClassService } from '../delete-class.service';
import { ClassEntity } from '@/classes/entities/class.entity';

describe('DeleteClassService', () => {
  let service: DeleteClassService;

  const creatorEmail = 'mock.creatorEmail';
  const id = 'mock.id';

  const classResult = {
    id,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeleteClassService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    mockPrismaService.class.findUnique.mockReturnValue(classResult);
    mockPrismaService.class.delete.mockResolvedValue(classResult);

    service = module.get<DeleteClassService>(DeleteClassService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should invoke prismaService and call class.delete', async () => {
    await service.run(id, creatorEmail);

    expect(mockPrismaService.class.delete).toHaveBeenLastCalledWith({
      where: {
        id,
      },
    });
  });

  it('should return entity deleted in instance of classEntity', async () => {
    const response = await service.run(id, creatorEmail);

    expect(response).toBeDefined();
    expect(response).toBeInstanceOf(ClassEntity);
  });

  it('should invoke SystemHistoryProxyService and call createRecordStandard method', async () => {
    await service.run(id, creatorEmail);

    expect(
      mockSystemHistoryProxyService.createRecordStandard,
    ).toHaveBeenLastCalledWith(
      creatorEmail,
      ActionEnum.DELETE,
      classResult,
      Resources.CLASS,
    );
  });

  it('should throw NotFoundExcpetion when class not exists', async () => {
    mockPrismaService.class.findUnique.mockResolvedValue(null);

    let error = null;
    try {
      await service.run(id, creatorEmail);
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(NotFoundException);
    expect(error.message).toBe('Recurso buscado impossível de ser encontrado.');
  });

  it('should throw BadRequestException when endDate is After currentDate', async () => {
    mockPrismaService.class.findUnique.mockResolvedValue({
      endAt: subDays(new Date(), 10),
    });

    let error = null;
    try {
      await service.run(id, creatorEmail);
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(BadRequestException);
    expect(error.message).toBe(
      'A data de término já passou da data atual, impossível deletar.',
    );
  });
});
