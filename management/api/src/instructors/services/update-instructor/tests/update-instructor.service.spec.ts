import { Test, TestingModule } from '@nestjs/testing';
import {
  handleModuleDependencies,
  mockPrismaService,
  mockSystemHistoryProxyService,
} from '@/utils';
import { InstructorEntity } from '@/instructors/entities/instructor.entity';
import { ActionEnum } from '@/system-history/interface/system-history.interface';
import { Resources } from '@/common';
import { UpdateInstructorService } from '../update-instructor.service';
import { UpdateInstructorDto } from '../dto/update-instructor.dto';

describe('UpdateInstructorService', () => {
  let service: UpdateInstructorService;

  const id = 'mock.id';
  const creatorEmail = 'mock.creatorEmail';

  const dto: UpdateInstructorDto = {
    cpf: 'mock.cpf',
    name: 'mock.name',
  };

  const instructorResult = {
    id: 'mock.id',
    ...dto,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdateInstructorService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    mockPrismaService.instructor.update.mockResolvedValue(instructorResult);

    service = module.get<UpdateInstructorService>(UpdateInstructorService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should invoke prismaService and call instructor.update', async () => {
    await service.run(id, creatorEmail, dto);

    expect(mockPrismaService.instructor.update).toHaveBeenCalledWith({
      data: dto,
      where: { id },
    });
  });

  it('should update instructor and return in instance InstructorEntity', async () => {
    const result = await service.run(id, creatorEmail, dto);

    expect(result).toBeInstanceOf(InstructorEntity);
  });

  it('should invoke systemHistoryProxyService and call createRecordStandard', async () => {
    await service.run(id, creatorEmail, dto);

    expect(
      mockSystemHistoryProxyService.createRecordStandard,
    ).toHaveBeenCalledWith(
      creatorEmail,
      ActionEnum.UPDATE,
      instructorResult,
      Resources.INSTRUCTOR,
    );
  });
});
