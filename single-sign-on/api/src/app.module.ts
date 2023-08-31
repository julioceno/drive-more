import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/guards';
import { RolesGuard } from './common';
import { jwtModuleConfigs } from './config/jwt-module.configs';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { SystemHistoryModule } from './system-history/system-history.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PrismaModule,
    jwtModuleConfigs(),
    SystemHistoryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
