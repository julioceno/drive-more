export const prismaMethods = () => ({
  findUnique: jest.fn(),
  findFirst: jest.fn(),
  findMany: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  deleteMany: jest.fn(),
  count: jest.fn(),
});

export const mockPrismaService = {
  instructor: prismaMethods(),
  student: prismaMethods(),
  class: prismaMethods(),
};
