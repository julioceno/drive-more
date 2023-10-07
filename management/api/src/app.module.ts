import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard } from './common/guards';
import { ssoClientConfigs } from './config/sso-client.configs';
import { InstructorsModule } from './instructors/instructors.module';
import { SsoModule } from './sso/sso.module';
import { SystemHistoryModule } from './system-history/system-history.module';
import { PrismaModule } from './prisma/prisma.module';
import { StudentsModule } from './students/students.module';

@Module({
  imports: [
    SsoModule,
    ssoClientConfigs(),
    InstructorsModule,
    SystemHistoryModule,
    PrismaModule,
    StudentsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
