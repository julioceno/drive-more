import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

const protoPath = join(
  __dirname,
  '../../',
  process.env.NODE_ENV === 'test' ? '' : '../',
  '/grpc/system-history/system-history.proto',
);

export function systemHistoryConfigs() {
  return ClientsModule.register([
    {
      name: 'SYSTEM_HISTORY_PACKAGE',
      transport: Transport.GRPC,
      options: {
        package: 'system_history',
        url: `${process.env.GRPC_SYSTEM_HISTORY_HOST}:${process.env.GRPC_SYSTEM_HISTORY_PORT}`,
        protoPath,
      },
    },
  ]);
}
