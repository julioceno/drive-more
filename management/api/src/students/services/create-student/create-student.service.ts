import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { Student } from '@prisma/client';
import { SystemHistoryProxyService } from '@/system-history/services/system-history-proxy/system-history-proxy.service';
import { ActionEnum } from '@/system-history/interface/system-history.interface';
import { Resources } from '@/common';
import { StudentEntity } from '@/students/entities/student.entity';

@Injectable()
export class CreateStudentService {
  private readonly logger = new Logger(
    `@services/${CreateStudentService.name}`,
  );

  constructor(
    private readonly prismaService: PrismaService,
    private readonly systemHistoryProxyService: SystemHistoryProxyService,
  ) {}

  async run(creatorEmail: string, dto: CreateStudentDto) {
    const student = await this.createStudent(dto);

    this.createRecordHistory(creatorEmail, student);

    return new StudentEntity(student);
  }

  private createStudent(dto: CreateStudentDto) {
    return this.prismaService.student.create({
      data: dto,
    });
  }

  private async createRecordHistory(creatorEmail: string, student: Student) {
    return this.systemHistoryProxyService
      .createRecordStandard(
        creatorEmail,
        ActionEnum.CREATE,
        student,
        Resources.STUDENT,
      )
      .catch((err) => this.logger.error(`There was as error ${err}`));
  }
}
