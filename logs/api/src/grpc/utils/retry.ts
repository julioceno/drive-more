import { Logger } from '@nestjs/common';
import { GrpcExceptionStatus } from './grpcExceptionStatus';

export async function retry<T>(grpcCall: () => Promise<T>, logger: Logger) {
  try {
    logger.log('Using retry utilitary for gRPC');
    return grpcCall();
  } catch (err) {
    if (err.code === GrpcExceptionStatus.UNAVAILABLE) {
      logger.log('Service was in standy, retrying...');
      return grpcCall();
    }

    throw err;
  }
}
