import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { Student } from '@prisma/client';
import { SystemHistoryProxyService } from '@/system-history/services/system-history-proxy/system-history-proxy.service';
import { ActionEnum } from '@/system-history/interface/system-history.interface';
import { Resources } from '@/common';
import { StudentEntity } from '@/students/entities/student.entity';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class UpdateStudentService {
  private readonly logger = new Logger(
    `@services/${UpdateStudentService.name}`,
  );

  constructor(
    private readonly prismaService: PrismaService,
    private readonly systemHistoryProxyService: SystemHistoryProxyService,
  ) {}

  async run(id: string, creatorEmail: string, dto: UpdateStudentDto) {
    const student = await this.updateStudent(id, dto);

    this.createRecordHistory(creatorEmail, student);

    return new StudentEntity(student);
  }

  private updateStudent(id: string, dto: UpdateStudentDto) {
    return this.prismaService.student.update({
      where: { id },
      data: dto,
    });
  }

  private async createRecordHistory(creatorEmail: string, student: Student) {
    return this.systemHistoryProxyService
      .createRecordStandard(
        creatorEmail,
        ActionEnum.UPDATE,
        student,
        Resources.STUDENT,
      )
      .catch((err) => this.logger.error(`There was as error ${err}`));
  }
}
