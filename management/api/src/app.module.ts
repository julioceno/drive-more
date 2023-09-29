import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ssoClientConfigs } from './config/sso-client.configs';

@Module({
  imports: [ssoClientConfigs()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
