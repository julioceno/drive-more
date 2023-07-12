import { PrismaModule } from '@/prisma/prisma.module';
import { UsersModule } from '@/users/users.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { GenerateTokenService } from './services/generate-token/generate-token.service';
import { SignInService } from './services/sign-in/sign-in.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, GenerateTokenService, SignInService],
  imports: [
    PrismaModule,
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '15d' },
    }),
  ],
  exports: [AuthService],
})
export class AuthModule {}
