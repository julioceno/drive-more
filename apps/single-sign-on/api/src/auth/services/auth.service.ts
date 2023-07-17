import { Injectable } from '@nestjs/common';
import { SignInDto } from './sign-in/dto/sign-in.dto';
import { SignInService } from './sign-in/sign-in.service';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { RefreshTokenDto } from './refresh-token/dto/refresh-token.dto';
import { LogoutService } from './logout/logout.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly signInService: SignInService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly logoutService: LogoutService,
  ) {}

  signIn(dto: SignInDto) {
    return this.signInService.run(dto);
  }

  refreshToken(dto: RefreshTokenDto) {
    return this.refreshTokenService.run(dto);
  }

  logout(userId: string) {
    return this.logoutService.run(userId);
  }
}
