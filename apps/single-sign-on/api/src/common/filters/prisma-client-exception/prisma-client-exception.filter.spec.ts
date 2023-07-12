import { PrismaClientExceptionFilter } from './prisma-client-exception.filter';

// TODO: create test for this filter
describe('PrismaClientExceptionFilter', () => {
  it('should be defined', () => {
    expect(new PrismaClientExceptionFilter()).toBeDefined();
  });
});
