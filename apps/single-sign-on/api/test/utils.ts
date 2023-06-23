import { CanActivate } from '@nestjs/common';

export class MockAuthorizationGuard implements CanActivate {
  canActivate(): boolean {
    return true;
  }
}
