import { AuthorizedUser, Public } from '@/common';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RefreshTokenDto } from '../services/refresh-token/dto/refresh-token.dto';
import { SignInDto } from '../services/sign-in/dto/sign-in.dto';

@Controller('auth')
@Public()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }

  @Post('refresh-token')
  refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto);
  }

  @Post('logout')
  logout(@AuthorizedUser('id') userId: string) {
    return this.authService.logout(userId);
  }
}
