import { Resources } from '@/common';
import { InstructorEntity } from '@/instructors/entities/instructor.entity';
import { PrismaService } from '@/prisma/prisma.service';
import { ActionEnum } from '@/system-history/interface/system-history.interface';
import { SystemHistoryProxyService } from '@/system-history/services/system-history-proxy/system-history-proxy.service';
import { Injectable, Logger } from '@nestjs/common';
import { Instructor } from '@prisma/client';

@Injectable()
export class DeleteInstructorService {
  private readonly logger = new Logger(
    `@services/${DeleteInstructorService.name}`,
  );

  constructor(
    private readonly prismaService: PrismaService,
    private readonly systemHistoryProxyService: SystemHistoryProxyService,
  ) {}

  async run(id: string, creatorEmail: string) {
    const instructor = await this.deleteInstructor(id);

    this.createRecordHistory(creatorEmail, instructor);

    return new InstructorEntity(instructor);
  }

  private deleteInstructor(id: string) {
    return this.prismaService.instructor.delete({ where: { id } });
  }

  private async createRecordHistory(creatorEmail: string, user: Instructor) {
    return this.systemHistoryProxyService
      .createRecordStandard(
        creatorEmail,
        ActionEnum.DELETE,
        user,
        Resources.INSTRUCTOR,
      )
      .catch((err) => this.logger.error(`There was as error ${err}`));
  }
}
