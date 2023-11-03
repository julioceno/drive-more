import { Resources } from '@/common';
import { PrismaService } from '@/prisma/prisma.service';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { join } from 'path';
import { ClassAdpter } from './adpters/class.adpter';
import { GeneratePdfDto } from './dto/generate-pdf.dto';

import { ActionEnum } from '@/system-history/interface/system-history.interface';
import { SystemHistoryProxyService } from '@/system-history/services/system-history-proxy/system-history-proxy.service';
import { Student } from '@prisma/client';
import { Request } from 'express';
import { Worker } from 'node:worker_threads';
import { IBuildData } from './types';

@Injectable()
export class GeneratePdfService {
  private readonly logger = new Logger(`@service/${GeneratePdfService.name}`);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly systemHistoryProxyService: SystemHistoryProxyService,
  ) {}

  async run(creatorEmail: string, dto: GeneratePdfDto, req: Request) {
    const { studentId, timeZone } = dto;

    this.logger.log('Find by student and classes...');
    const [student, classes] = await Promise.all([
      this.getStudent(studentId),
      this.getClasses(studentId),
    ]);

    if (!student) {
      throw new NotFoundException('Aluno não encontrado.');
    }

    if (!classes.length) {
      throw new NotFoundException(
        'Não existe nenhuma aula pendente para esse aluno.',
      );
    }

    this.logger.log(`Student by id ${student.id} found`);

    const data = this.buildData(student, classes, timeZone, req);
    const url = await this.handleGeneratePdf(data);

    this.createRecordHistory(creatorEmail, student.code);

    return { url };
  }

  private getClasses(studentId: string) {
    return this.prismaService.class.findMany({
      where: {
        studentId,
        startAt: {
          gt: new Date(),
        },
      },
      include: {
        category: true,
        instructor: true,
      },
    });
  }

  private getStudent(studentId: string) {
    return this.prismaService.student.findUnique({ where: { id: studentId } });
  }

  private async handleGeneratePdf(data: IBuildData) {
    this.logger.log('Generate pdf...');
    try {
      const url = await this.generatePdf(data);
      this.logger.log(`Pdf generated with url: "${url}"`);

      return url;
    } catch (err) {
      this.logger.error(`There was as error: ${JSON.stringify(err, null, 2)}`);
      throw new BadRequestException('Ocorreu um erro ao tentar gerar o pdf.');
    }
  }

  private async generatePdf(data: IBuildData): Promise<string> {
    return new Promise((resolve, reject) => {
      const worker = new Worker(join(__dirname, 'build-pdf.ts'));

      worker.on('message', resolve);
      worker.on('error', reject);

      worker.postMessage(data);
    });
  }

  private buildData(
    student: Student,
    classes: any[],
    timeZone: string,
    req: Request,
  ): IBuildData {
    const url = `${req.protocol}://${req.get('Host')}`;
    const adpter = new ClassAdpter(timeZone);

    const classesFormatted = classes.map((classRecord) =>
      adpter.adapt(classRecord),
    );

    return {
      studentName: student.name,
      classes: classesFormatted,
      url,
      timeZone,
    };
  }

  private createRecordHistory(creatorEmail: string, studentCode: number) {
    return this.systemHistoryProxyService
      .createRecordCustom({
        action: ActionEnum.OTHER,
        creatorEmail,
        entityId: studentCode,
        payload: `Gerando documento com as aulas do aluno.`,
        resourceName: Resources.STUDENT,
      })
      .catch((err) =>
        this.logger.error(`There was as error ${JSON.stringify(err, null, 2)}`),
      );
  }
}
