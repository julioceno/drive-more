import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { jwtConstants } from './constants';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { GenerateTokenService } from './services/generate-token/generate-token.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SignInService } from './services/sign-in/sign-in.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    GenerateTokenService,
    SignInService,
  ],
  imports: [
    PrismaModule,
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '3m' },
    }),
  ],
  exports: [AuthService],
})
export class AuthModule {}
