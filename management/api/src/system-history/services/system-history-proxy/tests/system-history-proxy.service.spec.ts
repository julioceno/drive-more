import { Test, TestingModule } from '@nestjs/testing';
import { SystemHistoryProxyService } from '../system-history-proxy.service';
import {
  handleModuleDependencies,
  mockCreateRecordService,
  mockFindEntityDatabaseService,
} from '@/utils';
import {
  ActionEnum,
  ICreateRecordParams,
} from '@/system-history/interface/system-history.interface';
import { Resources } from '@/common';
import { formatToPrismaJsonObject } from '@/system-history/utils';

describe('SystemHistoryProxyService', () => {
  let service: SystemHistoryProxyService;

  const mockId = 'mock.id';
  const creatorEmail = 'mock.creatorEmail';
  const payload = 'mock.payload';
  const code = 1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SystemHistoryProxyService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    service = module.get<SystemHistoryProxyService>(SystemHistoryProxyService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call createRecordCustom before invoke createRecordService and call run method', async () => {
    const dto: Omit<ICreateRecordParams, 'moduleName'> = {
      action: ActionEnum.CREATE,
      creatorEmail,
      entityId: mockId,
      payload,
      resourceName: Resources.INSTRUCTOR,
    };
    await service.createRecordCustom(dto);

    expect(mockCreateRecordService.run).toHaveBeenLastCalledWith(dto);
  });

  it('should call createRecordStandard after invoke findEntityDatabaseService and call run method and after again invoke createRecordService and call run method', async () => {
    const user = {
      id: mockId,
      code,
    };

    mockFindEntityDatabaseService.run.mockResolvedValue(user);

    await service.createRecordStandard(
      creatorEmail,
      ActionEnum.CREATE,
      {
        id: mockId,
        code,
      },
      Resources.INSTRUCTOR,
    );

    expect(mockFindEntityDatabaseService.run).toHaveBeenLastCalledWith(
      mockId,
      Resources.INSTRUCTOR,
    );

    expect(mockCreateRecordService.run).toHaveBeenLastCalledWith({
      action: ActionEnum.CREATE,
      creatorEmail,
      entityId: code,
      payload: JSON.stringify(formatToPrismaJsonObject(user)),
      resourceName: Resources.INSTRUCTOR,
    });
  });
});
