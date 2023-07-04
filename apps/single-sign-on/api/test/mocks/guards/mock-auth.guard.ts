import { IAuthorizedUser } from '@/common/interfaces';
import { CanActivate, ExecutionContext } from '@nestjs/common';

export const mockAuthorizedUser = (): IAuthorizedUser => ({
  id: '92ab7ca5-f68a-4723-8a5f-efad6caaf257',
});

export class MockAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    request.cookies = { token: 'xpto' };
    request.user = mockAuthorizedUser();

    return true;
  }
}
