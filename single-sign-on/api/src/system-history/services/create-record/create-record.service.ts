import {
  ActionEnum,
  ICreateRecordParams,
  IGRPCSystemHistoryService,
} from '@/system-history/interface/system-history.interface';
import { retry } from '@/utils';
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

  private readonly MODULE_NAME = 'SYSTEM HISTORY';
  private systemHistoryService: IGRPCSystemHistoryService;

  constructor(@Inject('SYSTEM_HISTORY_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.systemHistoryService =
      this.client.getService<IGRPCSystemHistoryService>('SystemHistoryService');
  }

  async run(data: Omit<ICreateRecordParams, 'modelName'>) {
    this.logger.log(`Create log from user=${data.creatorEmail}`);

    try {
      /*     const record = await retry(
        async () => await firstValueFrom(this.createRecord(data)),
        this.logger,
      ); */

      console.log({ data });

      const record = await firstValueFrom(this.createRecord(data));

      this.logger.log('Record Created');

      console.log({ record });
      return record;
    } catch (err) {
      this.logger.error('There was an error');
      throw new BadGatewayException();
    }
  }

  private createRecord(data: Omit<ICreateRecordParams, 'modelName'>) {
    return this.systemHistoryService.createRecord({
      action: data.action,
      creatorEmail: data.creatorEmail,
      entityId: data.entityId,
      resourceName: data.resourceName,
      payload: data.payload,
      modelName: this.MODULE_NAME,
    });
  }
}
