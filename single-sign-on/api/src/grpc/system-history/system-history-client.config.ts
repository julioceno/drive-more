import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

export function systemHistoryConfigs() {
  return ClientsModule.register([
    {
      name: 'SYSTEM_HISTORY_PACKAGE',
      transport: Transport.GRPC,
      options: {
        package: 'system_history',
        url: `${process.env.GRPC_SYSTEM_HISTORY_HOST}:${process.env.GRPC_SYSTEM_HISTORY_PORT}`,
        protoPath: join(
          __dirname,
          '../../../grpc/system-history/system-history.proto',
        ),
      },
    },
  ]);
}
