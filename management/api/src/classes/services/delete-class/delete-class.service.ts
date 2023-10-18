import { ClassEntity } from '@/classes/entities/class.entity';
import { Resources, messages } from '@/common';
import { PrismaService } from '@/prisma/prisma.service';
import { ActionEnum } from '@/system-history/interface/system-history.interface';
import { SystemHistoryProxyService } from '@/system-history/services/system-history-proxy/system-history-proxy.service';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Class } from '@prisma/client';
import { isAfter, isBefore } from 'date-fns';

@Injectable()
export class DeleteClassService {
  private readonly logger = new Logger(`@services/${DeleteClassService.name}`);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly systemHistoryProxyService: SystemHistoryProxyService,
  ) {}

  async run(id: string, creatorEmail: string) {
    await this.validateIfCanDelete(id);

    const classRecord = await this.deleteClass(id);

    this.createRecordHistory(creatorEmail, classRecord);

    return new ClassEntity(classRecord);
  }

  private deleteClass(id: string) {
    return this.prismaService.class.delete({ where: { id } });
  }

  private async createRecordHistory(creatorEmail: string, student: Class) {
    return this.systemHistoryProxyService
      .createRecordStandard(
        creatorEmail,
        ActionEnum.DELETE,
        student,
        Resources.CLASS,
      )
      .catch((err) => {
        this.logger.error(`There was as error ${err}`);
      });
  }

  private async validateIfCanDelete(id: string) {
    const classRecord = await this.prismaService.class.findUnique({
      where: { id },
    });

    if (!classRecord) {
      throw new NotFoundException(messages.NOT_FOUND);
    }

    const endDateIsAfterCurrentDate = isAfter(classRecord.endAt, new Date());
    if (endDateIsAfterCurrentDate) {
      throw new BadRequestException(
        'A data de término já passou da data atual, impossível deletar.',
      );
    }
  }
}
