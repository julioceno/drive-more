import { Resources } from '@/common';
import { ActionEnum } from '@/system-history/interface/system-history.interface';
import {
  handleModuleDependencies,
  mockPrismaService,
  mockSystemHistoryProxyService,
} from '@/utils';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateStudentDto } from '../dto/update-student.dto';
import { UpdateStudentService } from '../update-student.service';
import { StudentEntity } from '@/students/entities/student.entity';

describe('UpdateStudentService', () => {
  let service: UpdateStudentService;

  const id = 'mock.id';
  const creatorEmail = 'mock.creatorEmail';

  const dto: UpdateStudentDto = {
    cpf: 'mock.cpf',
    name: 'mock.name',
  };

  const studentResult = {
    id: 'mock.id',
    ...dto,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdateStudentService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    mockPrismaService.student.update.mockResolvedValue(studentResult);

    service = module.get<UpdateStudentService>(UpdateStudentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should invoke prismaService and call student.update', async () => {
    await service.run(id, creatorEmail, dto);

    expect(mockPrismaService.student.update).toHaveBeenCalledWith({
      data: dto,
      where: { id },
    });
  });

  it('should update student and return in instance StudentEntity', async () => {
    const result = await service.run(id, creatorEmail, dto);

    expect(result).toBeInstanceOf(StudentEntity);
  });

  it('should invoke systemHistoryProxyService and call createRecordStandard', async () => {
    await service.run(id, creatorEmail, dto);

    expect(
      mockSystemHistoryProxyService.createRecordStandard,
    ).toHaveBeenCalledWith(
      creatorEmail,
      ActionEnum.UPDATE,
      studentResult,
      Resources.STUDENT,
    );
  });
});
