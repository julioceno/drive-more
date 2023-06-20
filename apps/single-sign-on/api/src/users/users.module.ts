import { Module } from '@nestjs/common';
import { CreateUserService } from './services/create-user/create-user.service';
import { UsersService } from './services/users.service';
import { UsersController } from './controller/users.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { GenerateTokenService } from '@/auth/services/generate-token/generate-token.service';
import { UpdateUserService } from './services/update-user/update-user.service';
import { FindOneUserService } from './services/find-one-user/find-one-user.service';

@Module({
  imports: [PrismaModule],
  providers: [
    UsersService,
    CreateUserService,
    GenerateTokenService,
    UpdateUserService,
    FindOneUserService,
  ],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
