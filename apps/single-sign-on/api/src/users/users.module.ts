import { Module } from '@nestjs/common';
import { CreateUserService } from './services/create-user/create-user.service';
import { UsersService } from './services/users.service';
import { UsersController } from './controller/users.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { GenerateTokenService } from '@/auth/services/generate-token/generate-token.service';

@Module({
  imports: [PrismaModule],
  providers: [UsersService, CreateUserService, GenerateTokenService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
