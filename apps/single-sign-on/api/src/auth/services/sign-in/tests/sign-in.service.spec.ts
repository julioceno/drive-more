import { handleModuleDependencies, mockPrismaService } from '@/utils';
import { Test, TestingModule } from '@nestjs/testing';
import { SignInService } from '../sign-in.service';

describe('SignInService', () => {
  let service: SignInService;

  const userId = 'mock.id';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SignInService],
    })
      .useMocker(handleModuleDependencies)
      .compile();

    service = module.get<SignInService>(SignInService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
