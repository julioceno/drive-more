import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { developmentConfig } from './development.config';

const configModuleExports = NestConfigModule.forRoot({
  isGlobal: true,
  load: [developmentConfig],
});

@Global()
@Module({
  imports: [configModuleExports],
  exports: [configModuleExports],
})
export class ConfigModule {}
