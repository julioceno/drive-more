import { Injectable } from '@nestjs/common';
import { SignInDto } from './sign-in/dto/sign-in.dto';
import { SignInService } from './sign-in/sign-in.service';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { RefreshTokenDto } from './refresh-token/dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly signInService: SignInService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}
  signIn(dto: SignInDto) {
    return this.signInService.run(dto);
  }

  refreshToken(dto: RefreshTokenDto) {
    return this.refreshTokenService.run(dto);
  }
}
