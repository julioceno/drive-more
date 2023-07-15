import { ConfigModule } from '@/config/config.module';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

export function jwtModuleConfigs() {
  return JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get<string>('authToken.secret'),
      signOptions: {
        expiresIn: configService.get<string>('authToken.expiration'),
      },
    }),
    inject: [ConfigService],
  });
}
