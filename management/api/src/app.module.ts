import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClassesModule } from './classes/classes.module';
import { AuthGuard } from './common/guards';
import { ssoClientConfigs } from './config/sso-client.configs';
import { InstructorsModule } from './instructors/instructors.module';
import { PrismaModule } from './prisma/prisma.module';
import { SsoModule } from './sso/sso.module';
import { StudentsModule } from './students/students.module';
import { SystemHistoryModule } from './system-history/system-history.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    SsoModule,
    ssoClientConfigs(),
    InstructorsModule,
    SystemHistoryModule,
    PrismaModule,
    StudentsModule,
    ClassesModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
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
