import { Resources } from '@/common';
import { InstructorEntity } from '@/instructors/entities/instructor.entity';
import { PrismaService } from '@/prisma/prisma.service';
import { ActionEnum } from '@/system-history/interface/system-history.interface';
import { SystemHistoryProxyService } from '@/system-history/services/system-history-proxy/system-history-proxy.service';
import { Injectable, Logger } from '@nestjs/common';
import { Instructor } from '@prisma/client';
import { CreateInstructorDto } from './dto/create-instructor.dto';

@Injectable()
export class CreateInstructorService {
  private readonly logger = new Logger(
    `@services/${CreateInstructorService.name}`,
  );

  constructor(
    private readonly prismaService: PrismaService,
    private readonly systemHistoryProxyService: SystemHistoryProxyService,
  ) {}

  async run(creatorEmail: string, dto: CreateInstructorDto) {
    const instructor = await this.createInstrcutor(dto);

    this.createRecordHistory(creatorEmail, instructor);

    return new InstructorEntity(instructor);
  }

  private createInstrcutor(dto: CreateInstructorDto) {
    return this.prismaService.instructor.create({
      data: dto,
    });
  }

  private async createRecordHistory(
    creatorEmail: string,
    instructor: Instructor,
  ) {
    return this.systemHistoryProxyService
      .createRecordStandard(
        creatorEmail,
        ActionEnum.CREATE,
        instructor,
        Resources.INSTRUCTOR,
      )
      .catch((err) => this.logger.error(`There was as error ${err}`));
  }
}
