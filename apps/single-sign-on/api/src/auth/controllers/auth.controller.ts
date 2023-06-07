import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { Public } from 'src/common/decorators';
import { AuthService } from '../services/auth.service';
import { SignInDto } from '../services/sign-in/dto/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Public()
  signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get()
  findAll() {
    return [];
  }
}
