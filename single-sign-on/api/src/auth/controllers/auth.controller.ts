import { AuthorizedUser, Public } from '@/common';
import { Body, Controller, HttpStatus, Post, HttpCode } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RefreshTokenDto } from '../services/refresh-token/dto/refresh-token.dto';
import { SignInDto } from '../services/sign-in/dto/sign-in.dto';
import { VerifyTokenDto } from '../services/verify-token/dto/verify-token.dto';
import { GrpcMethod } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@AuthorizedUser('id') userId: string) {
    return this.authService.logout(userId);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('verify-token')
  @GrpcMethod('AuthService', 'VerifyToken')
  verifyToken(@Body() dto: VerifyTokenDto) {
    return this.authService.verifyToken(dto);
  }
}
