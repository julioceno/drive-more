import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { developmentConfig } from './development.config';

// this forRoot serves to instantiate the module and assign settings to it
const ConfigModuleExports = NestConfigModule.forRoot({
  isGlobal: true,
  load: [developmentConfig],
});

@Global()
@Module({
  imports: [ConfigModuleExports],
  exports: [ConfigModuleExports],
})
export class ConfigModule {}
