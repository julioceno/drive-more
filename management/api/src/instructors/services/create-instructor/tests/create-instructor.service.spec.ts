import { Test, TestingModule } from '@nestjs/testing';
import { CreateInstructorService } from '../create-instructor.service';
import { CreateInstructorDto } from '../dto/create-instructor.dto';
import {
  handleModuleDependencies,
  mockPrismaService,
  mockSystemHistoryProxyService,
} from '@/utils';
import { InstructorEntity } from '@/instructors/entities/instructor.entity';
import { ActionEnum } from '@/system-history/interface/system-history.interface';
import { Resources } from '@/common';

describe('CreateInstructorService', () => {
  let service: CreateInstructorService;

  const creatorEmail = 'mock.creatorEmail';

  const dto: CreateInstructorDto = {
    cpf: 'mock.cpf',
    name: 'mock.name',
  };

  const instructorResult = {
    id: 'mock.id',
    ...dto,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateInstructorService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    mockPrismaService.instructor.create.mockResolvedValue({
      id: 'mock.id',
      ...dto,
    });

    service = module.get<CreateInstructorService>(CreateInstructorService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should invoke prismaService and call instructor.create', async () => {
    const result = await service.run(creatorEmail, dto);

    expect(mockPrismaService.instructor.create).toHaveBeenCalledWith({
      data: dto,
    });
  });

  it('should create instructor and return in instance InstructorEntity', async () => {
    const result = await service.run(creatorEmail, dto);

    expect(result).toBeInstanceOf(InstructorEntity);
  });

  it('should invoke systemHistoryProxyService and call createRecordStandard', async () => {
    await service.run(creatorEmail, dto);

    expect(
      mockSystemHistoryProxyService.createRecordStandard,
    ).toHaveBeenCalledWith(
      creatorEmail,
      ActionEnum.CREATE,
      instructorResult,
      Resources.INSTRUCTOR,
    );
  });
});
