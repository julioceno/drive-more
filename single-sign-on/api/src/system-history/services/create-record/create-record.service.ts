import {
  ICreateRecordParams,
  IGRPCSystemHistoryService,
} from '@/system-history/interface/system-history.interface';
import { retry } from '@/utils/retry';
import {
  BadGatewayException,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CreateRecordService implements OnModuleInit {
  private readonly logger = new Logger(`@service/${CreateRecordService.name}`);

  private readonly MODULE_NAME = 'SINGLE SIGN ON';
  private systemHistoryService: IGRPCSystemHistoryService;

  constructor(@Inject('SYSTEM_HISTORY_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.systemHistoryService =
      this.client.getService<IGRPCSystemHistoryService>('SystemHistoryService');
  }

  async run(data: Omit<ICreateRecordParams, 'moduleName'>) {
    this.logger.log(`Create record from user=${data.creatorEmail}`);

    try {
      const record = await retry(
        async () => await firstValueFrom(this.createRecord(data)),
        this.logger,
      );

      this.logger.log('Record Created');

      return record;
    } catch (err) {
      this.logger.error('There was an error');
      throw new BadGatewayException();
    }
  }

  private createRecord(data: Omit<ICreateRecordParams, 'moduleName'>) {
    return this.systemHistoryService.create({
      action: data.action,
      creatorEmail: data.creatorEmail,
      entityId: data.entityId,
      resourceName: data.resourceName,
      payload: data.payload,
      moduleName: this.MODULE_NAME,
    });
  }
}
