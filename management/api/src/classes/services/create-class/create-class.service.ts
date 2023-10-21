import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { ClassEntity } from '@/classes/entities/class.entity';
import { SystemHistoryProxyService } from '@/system-history/services/system-history-proxy/system-history-proxy.service';
import { Class } from '@prisma/client';
import { ActionEnum } from '@/system-history/interface/system-history.interface';
import { Resources } from '@/common';
import { isAfter, isBefore, parseISO } from 'date-fns';

@Injectable()
export class CreateClassService {
  private readonly logger = new Logger(`@services/${CreateClassService.name}`);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly systemHistoryProxyService: SystemHistoryProxyService,
  ) {}

  async run(creatorEmail: string, dto: CreateClassDto) {
    const startAt = parseISO(dto.startAt);
    const endAt = parseISO(dto.endAt);

    const isPastDate = isBefore(startAt, new Date());
    if (isPastDate) {
      throw new BadRequestException(
        'A data de início deve ser uma data futura a atual.',
      );
    }

    const endDateValid = isAfter(endAt, startAt);
    if (!endDateValid) {
      throw new BadRequestException(
        'Data de término deve ser posterior à data início.',
      );
    }

    const classInTimeInterval = await this.getClassTimeInterval(dto);
    if (classInTimeInterval.length) {
      throw new BadRequestException(
        'Já existe uma aula nesse intervalo de tempo para o instrutor ou para o aluno.',
      );
    }

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

  private createRecordHistory(creatorEmail: string, classCreated: Class) {
    return this.systemHistoryProxyService
      .createRecordStandard(
        creatorEmail,
        ActionEnum.CREATE,
        classCreated,
        Resources.CLASS,
      )
      .catch((err) => this.logger.error(`There was as error ${err}`));
  }

  private getClassTimeInterval(dto: CreateClassDto) {
    const timeInterval = {
      gte: dto.startAt,
      lte: dto.endAt,
    };

    const timeIntervalFilter = {
      OR: [{ startAt: timeInterval }, { endAt: timeInterval }],
    };

    return this.prismaService.class.findMany({
      where: {
        OR: [
          {
            instructorId: dto.instructorId,
            ...timeIntervalFilter,
          },
          {
            studentId: dto.studentId,
            ...timeIntervalFilter,
          },
          {
            instructorId: dto.instructorId,
            studentId: dto.studentId,
            ...timeIntervalFilter,
          },
        ],
      },
    });
  }
}
