import { Resources } from '@/common';
import { PrismaService } from '@/prisma/prisma.service';
import { StudentEntity } from '@/students/entities/student.entity';
import { ActionEnum } from '@/system-history/interface/system-history.interface';
import { SystemHistoryProxyService } from '@/system-history/services/system-history-proxy/system-history-proxy.service';
import { Injectable, Logger } from '@nestjs/common';
import { Student } from '@prisma/client';

@Injectable()
export class DeleteStudentService {
  private readonly logger = new Logger(
    `@services/${DeleteStudentService.name}`,
  );

  constructor(
    private readonly prismaService: PrismaService,
    private readonly systemHistoryProxyService: SystemHistoryProxyService,
  ) {}

  async run(id: string, creatorEmail: string) {
    const student = await this.deleteStudent(id);

    this.createRecordHistory(creatorEmail, student);

    return new StudentEntity(student);
  }

  private deleteStudent(id: string) {
    return this.prismaService.student.delete({ where: { id } });
  }

  private async createRecordHistory(creatorEmail: string, student: Student) {
    return this.systemHistoryProxyService
      .createRecordStandard(
        creatorEmail,
        ActionEnum.DELETE,
        student,
        Resources.STUDENT,
      )
      .catch((err) => {
        this.logger.error(`There was as error ${err}`);
      });
  }
}
