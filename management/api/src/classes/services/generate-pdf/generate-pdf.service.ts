import { requireAsPlainTextConstructor } from '@/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { join } from 'path';
import puppeteer from 'puppeteer';
import { ClassAdpter } from './adpters/class.adpter';
import { GeneratePdfDto } from './dto/generate-pdf.dto';

const htmlPath = join(
  __dirname,
  '../../../',
  process.env.NODE_ENV === 'test' ? '' : '../',
  '/html/student-pdf.html',
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

    const adpter = new ClassAdpter();

    const classesFormatted = classes.map((classRecord) => {
      return adpter.adapt(classRecord);
    });

    const { url } = await this.generatePdf(student.name);

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

  private async generatePdf(studentName: string) {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    await Promise.all([
      page.setContent(html, { waitUntil: 'domcontentloaded' }),
      page.emulateMediaType('screen'),
    ]);

    const studentNameFormatted = studentName.replace(/ /g, '_');

    const documentName = `${studentNameFormatted}_${new Date().getTime()}.pdf`;

    const path = `files/${documentName}`;

    await page.pdf({
      path,
      margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
      printBackground: true,
      format: 'A4',
    });

    await browser.close();

    const url = join(__dirname, '..', '..', '..', '..', '..', path);

    return { url };
  }
}
