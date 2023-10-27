import { requireAsPlainTextConstructor } from '@/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { ClassAdpter } from './adpters/class.adpter';
import { GeneratePdfDto } from './dto/generate-pdf.dto';

import { Student } from '@prisma/client';
import { Worker } from 'node:worker_threads';

const htmlPath = join(
  __dirname,
  '../../../',
  process.env.NODE_ENV === 'test' ? '' : '../',
  '/template/student-pdf.hbs',
);

const html = requireAsPlainTextConstructor(htmlPath);

@Injectable()
export class GeneratePdfService {
  constructor(private readonly prismaService: PrismaService) {}

  async run(creatorEmail: string, dto: GeneratePdfDto) {
    const { studentId } = dto;

    const [student, classes] = await Promise.all([
      this.getStudent(studentId),
      this.getClasses(studentId),
    ]);

    const data = this.buildData(student, classes, dto.timeZone);

    const returned = await this.generatePdf(data);

    return { returned };
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

  private async generatePdf(data: any) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(join(__dirname, 'build-pdf'));
      worker.on('message', (value) => {
        resolve(value);
      });
      worker.on('error', resolve);
      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error('Worker stopped: ' + code));
        }
      });

      worker.postMessage(data);
    });
  }

  private buildData(student: Student, classes: any[], timeZone: string) {
    const adpter = new ClassAdpter(timeZone);

    const classesFormatted = classes.map((classRecord) =>
      adpter.adapt(classRecord),
    );

    return { studentName: student.name, classes: classesFormatted };
  }
}
