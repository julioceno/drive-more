import { AuthorizedUser, Public } from '@/common';
import { Body, Controller, HttpStatus, Post, HttpCode } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RefreshTokenDto } from '../services/refresh-token/dto/refresh-token.dto';
import { SignInDto } from '../services/sign-in/dto/sign-in.dto';
import { VerifyTokenDto } from '../services/verify-token/dto/verify-token.dto';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
@Public()
// TODO: create unitary and e2e tests
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('verify-token')
  @GrpcMethod('AuthService', 'VerifyToken')
  verifyToken(@Body() dto: VerifyTokenDto) {
    return this.authService.verifyToken(dto);
  }
}
