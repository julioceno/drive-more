import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

export function ssoClientConfigs() {
  return ClientsModule.register([
    {
      name: 'AUTH_PACKAGE',
      transport: Transport.GRPC,
      options: {
        package: 'single_sign_on',
        protoPath: join(
          __dirname,
          '../../grpc/single-sign-on/single-sign-on.proto',
        ),
      },
    },
  ]);
}
