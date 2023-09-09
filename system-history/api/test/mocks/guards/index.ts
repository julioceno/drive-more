import { IAuthorizedUser, RoleEnum } from '@/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';

export const mockAuthorizedUser = (): IAuthorizedUser => ({
  id: '92ab7ca5-f68a-4723-8a5f-efad6caaf257',
  clientId: 'eec7a35e-1540-44c8-b4a3-ebeab026da00',
  role: RoleEnum.USER,
});

export class MockAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    request.cookies = { token: 'xpto' };
    request.user = mockAuthorizedUser();

    return true;
  }
}
