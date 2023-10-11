import { Test, TestingModule } from '@nestjs/testing';
import {
  handleModuleDependencies,
  mockPrismaService,
  mockSystemHistoryProxyService,
} from '@/utils';
import { ActionEnum } from '@/system-history/interface/system-history.interface';
import { Resources } from '@/common';
import { CreateStudentService } from '../create-student.service';
import { CreateStudentDto } from '../dto/create-student.dto';
import { StudentEntity } from '@/students/entities/student.entity';

describe('CreateStudentService', () => {
  let service: CreateStudentService;

  const creatorEmail = 'mock.creatorEmail';

  const dto: CreateStudentDto = {
    cpf: 'mock.cpf',
    name: 'mock.name',
  };

  const studentResult = {
    id: 'mock.id',
    ...dto,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateStudentService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    mockPrismaService.student.create.mockResolvedValue(studentResult);

    service = module.get<CreateStudentService>(CreateStudentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should invoke prismaService and call student.create', async () => {
    await service.run(creatorEmail, dto);

    expect(mockPrismaService.student.create).toHaveBeenCalledWith({
      data: dto,
    });
  });

  it('should create student and return in instance StudentEntity', async () => {
    const result = await service.run(creatorEmail, dto);

    expect(result).toBeInstanceOf(StudentEntity);
  });

  it('should invoke systemHistoryProxyService and call createRecordStandard', async () => {
    await service.run(creatorEmail, dto);

    expect(
      mockSystemHistoryProxyService.createRecordStandard,
    ).toHaveBeenCalledWith(
      creatorEmail,
      ActionEnum.CREATE,
      studentResult,
      Resources.STUDENT,
    );
  });
});
