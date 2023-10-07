import { Test, TestingModule } from '@nestjs/testing';
import {
  handleModuleDependencies,
  mockPrismaService,
  mockSystemHistoryProxyService,
} from '@/utils';
import { InstructorEntity } from '@/instructors/entities/instructor.entity';
import { ActionEnum } from '@/system-history/interface/system-history.interface';
import { Resources } from '@/common';
import { DeleteInstructorService } from '../delete-instructor.service';

describe('DeleteInstructorService', () => {
  let service: DeleteInstructorService;

  const creatorEmail = 'mock.creatorEmail';

  const id = 'mock.id';

  const instructorResult = {
    id,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeleteInstructorService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    mockPrismaService.instructor.delete.mockResolvedValue(instructorResult);

    service = module.get<DeleteInstructorService>(DeleteInstructorService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should invoke prismaService and call instructor.delete', async () => {
    await service.run(id, creatorEmail);

    expect(mockPrismaService.instructor.delete).toHaveBeenLastCalledWith({
      where: {
        id,
      },
    });
  });

  it('should return entity deleted in instance of InstructorEntity', async () => {
    const response = await service.run(id, creatorEmail);

    expect(response).toBeDefined();
    expect(response).toBeInstanceOf(InstructorEntity);
  });

  it('should invoke SystemHistoryProxyService and call createRecordStandard method', async () => {
    await service.run(id, creatorEmail);

    expect(
      mockSystemHistoryProxyService.createRecordStandard,
    ).toHaveBeenLastCalledWith(
      creatorEmail,
      ActionEnum.DELETE,
      instructorResult,
      Resources.INSTRUCTOR,
    );
  });
});
