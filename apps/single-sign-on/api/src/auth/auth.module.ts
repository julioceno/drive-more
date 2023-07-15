import { jwtModuleConfigs } from '@/config/jwt-module.configs';
import { PrismaModule } from '@/prisma/prisma.module';
import { UsersModule } from '@/users/users.module';
import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { GenerateTokenService } from './services/generate-token/generate-token.service';
import { SignInService } from './services/sign-in/sign-in.service';

@Module({
  imports: [PrismaModule, UsersModule, jwtModuleConfigs()],
  controllers: [AuthController],
  providers: [AuthService, GenerateTokenService, SignInService],
  exports: [AuthService],
})
export class AuthModule {}
