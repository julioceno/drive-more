import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SsoModule } from './sso/sso.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common';
import { VerifyTokenService } from './sso/services/verify-token/verify-token.service';
import { ssoClientConfigs } from './config/sso-client.configs';
import { ConfigModule } from './config/config.module';
import { RecordsModule } from './records/records.module';

@Module({
  imports: [SsoModule, ssoClientConfigs(), ConfigModule, RecordsModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    VerifyTokenService,
  ],
})
export class AppModule {}
