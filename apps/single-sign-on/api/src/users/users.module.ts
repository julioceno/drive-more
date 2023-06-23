import { Module } from '@nestjs/common';
import { CreateUserService } from './services/create-user/create-user.service';
import { UsersService } from './services/users.service';
import { UsersController } from './controller/users.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { GenerateTokenService } from '@/auth/services/generate-token/generate-token.service';
import { UpdateUserService } from './services/update-user/update-user.service';
import { FindOneUserService } from './services/find-one-user/find-one-user.service';
import { FindAllUsersService } from './services/find-all-users/find-all-users.service';
import { UpdatePasswordUserService } from './services/update-password-user/update-password-user.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, JwtModule],
  providers: [
    UsersService,
    CreateUserService,
    GenerateTokenService,
    UpdateUserService,
    FindOneUserService,
    FindAllUsersService,
    UpdatePasswordUserService,
  ],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
