import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { SystemHistoryProxyService } from '@/system-history/services/system-history-proxy/system-history-proxy.service';
import { Instructor } from '@prisma/client';
import { ActionEnum } from '@/system-history/interface/system-history.interface';
import { Resources } from '@/common';
import { InstructorEntity } from '@/instructors/entities/instructor.entity';

@Injectable()
export class UpdateInstructorService {
  private readonly logger = new Logger(
    `@services/${UpdateInstructorService.name}`,
  );

  constructor(
    private readonly prismaService: PrismaService,
    private readonly systemHistoryProxyService: SystemHistoryProxyService,
  ) {}

  async run(id: string, creatorEmail: string, dto: UpdateInstructorDto) {
    const instructor = await this.updateInstructor(id, dto);

    this.createRecordHistory(creatorEmail, instructor);

    return new InstructorEntity(instructor);
  }

  private updateInstructor(id: string, dto: UpdateInstructorDto) {
    return this.prismaService.instructor.update({
      where: { id },
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
        ActionEnum.UPDATE,
        instructor,
        Resources.INSTRUCTOR,
      )
      .catch((err) => this.logger.error(`There was as error ${err}`));
  }
}
