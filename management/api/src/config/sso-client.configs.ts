import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

const protoPath = join(
  __dirname,
  '../',
  process.env.NODE_ENV === 'test' ? '' : '../',
  '/grpc/single-sign-on/single-sign-on.proto',
);

export function ssoClientConfigs() {
  return ClientsModule.register([
    {
      name: 'SSO_PACKAGE',
      transport: Transport.GRPC,
      options: {
        package: 'single_sign_on',
        url: `${process.env.GRPC_SSO_HOST}:${process.env.GRPC_SSO_PORT}`,
        protoPath,
      },
    },
  ]);
}
