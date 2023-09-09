import { ssoClientConfigs } from '../config/sso-client.configs';
import { Module } from '@nestjs/common';
import { SsoService } from './services/sso.service';
import { VerifyTokenService } from './services/verify-token/verify-token.service';
import { ConfigModule } from '../config/config.module';

@Module({
  exports: [SsoService],
  imports: [ssoClientConfigs(), ConfigModule],
  providers: [SsoService, VerifyTokenService],
})
export class SsoModule {}
