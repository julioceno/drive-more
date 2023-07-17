export const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
    count: jest.fn(),
  },
  role: {
    findUnique: jest.fn(),
    findUniqueOrThrow: jest.fn(),
  },
  refreshToken: {
    deleteMany: jest.fn(),
  },
};
