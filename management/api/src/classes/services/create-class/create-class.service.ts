import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { ClassEntity } from '@/classes/entities/class.entity';
import { SystemHistoryProxyService } from '@/system-history/services/system-history-proxy/system-history-proxy.service';
import { Class } from '@prisma/client';
import { ActionEnum } from '@/system-history/interface/system-history.interface';
import { Resources } from '@/common';

@Injectable()
export class CreateClassService {
  private readonly logger = new Logger(`@services/${CreateClassService.name}`);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly systemHistoryProxyService: SystemHistoryProxyService,
  ) {}

  async run(dto: CreateClassDto, creatorEmail: string) {
    const classCreated = await this.createClass(dto);

    this.createRecordHistory(creatorEmail, classCreated);

    return new ClassEntity(classCreated);
  }

  private createClass(dto: CreateClassDto) {
    return this.prismaService.class.create({
      data: {
        categoryId: dto.categoryId,
        studentId: dto.studentId,
        instructorId: dto.instructorId,

        startAt: dto.startAt,
        endAt: dto.endAt,
      },
    });
  }

  private async createRecordHistory(creatorEmail: string, classCreated: Class) {
    return this.systemHistoryProxyService
      .createRecordStandard(
        creatorEmail,
        ActionEnum.CREATE,
        classCreated,
        Resources.CLASS,
      )
      .catch((err) => this.logger.error(`There was as error ${err}`));
  }
}
