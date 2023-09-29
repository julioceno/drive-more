import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ssoClientConfigs } from './config/sso-client.configs';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common/guards';
import { SsoModule } from './sso/sso.module';

@Module({
  imports: [SsoModule, ssoClientConfigs()],
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
