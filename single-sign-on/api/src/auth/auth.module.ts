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
import { LogoutService } from './services/logout/logout.service';
import { VerifyTokenService } from './services/verify-token/verify-token.service';
import { SystemHistoryModule } from '@/system-history/system-history.module';
import { SystemHistoryProxyService } from '@/system-history/services/system-history-proxy/system-history-proxy.service';

@Module({
  imports: [PrismaModule, UsersModule, jwtModuleConfigs(), SystemHistoryModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    GenerateTokenService,
    SignInService,
    GenerateRefreshTokenService,
    RefreshTokenService,
    LogoutService,
    VerifyTokenService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
