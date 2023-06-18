export const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  role: {
    findUniqueOrThrow: jest.fn(),
  },
};
