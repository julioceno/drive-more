import { Test, TestingModule } from '@nestjs/testing';
import {
  handleModuleDependencies,
  mockPrismaService,
  mockSystemHistoryProxyService,
} from '@/utils';
import { ActionEnum } from '@/system-history/interface/system-history.interface';
import { Resources } from '@/common';
import { DeleteStudentService } from '../delete-student.service';
import { StudentEntity } from '@/students/entities/student.entity';

describe('DeleteStudentService', () => {
  let service: DeleteStudentService;

  const creatorEmail = 'mock.creatorEmail';

  const id = 'mock.id';

  const studentResult = {
    id,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeleteStudentService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    mockPrismaService.student.delete.mockResolvedValue(studentResult);

    service = module.get<DeleteStudentService>(DeleteStudentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should invoke prismaService and call student.delete', async () => {
    await service.run(id, creatorEmail);

    expect(mockPrismaService.student.delete).toHaveBeenLastCalledWith({
      where: {
        id,
      },
    });
  });

  it('should return entity deleted in instance of StudentEntity', async () => {
    const response = await service.run(id, creatorEmail);

    expect(response).toBeDefined();
    expect(response).toBeInstanceOf(StudentEntity);
  });

  it('should invoke SystemHistoryProxyService and call createRecordStandard method', async () => {
    await service.run(id, creatorEmail);

    expect(
      mockSystemHistoryProxyService.createRecordStandard,
    ).toHaveBeenLastCalledWith(
      creatorEmail,
      ActionEnum.DELETE,
      studentResult,
      Resources.STUDENT,
    );
  });
});
