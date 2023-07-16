import { jwtModuleConfigs } from '@/config/jwt-module.configs';
import { PrismaModule } from '@/prisma/prisma.module';
import { UsersModule } from '@/users/users.module';
import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { GenerateTokenService } from './services/generate-token/generate-token.service';
import { SignInService } from './services/sign-in/sign-in.service';
import { GenerateRefreshTokenService } from './services/generate-refresh-token/generate-refresh-token.service';
import { RefreshTokenService } from './services/refresh-token/refresh-token.service';

@Module({
  imports: [PrismaModule, UsersModule, jwtModuleConfigs()],
  controllers: [AuthController],
  providers: [
    AuthService,
    GenerateTokenService,
    SignInService,
    GenerateRefreshTokenService,
    RefreshTokenService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
