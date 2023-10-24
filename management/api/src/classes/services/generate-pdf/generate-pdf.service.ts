import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { GeneratePdfDto } from './dto/generate-pdf.dto';
import { ClassAdpter } from './adpters/class.adpter';
import { requireAsPlainTextConstructor } from '@/common';
import { join } from 'path';
import { generatePdf } from 'html-pdf-node';
import { writeFile } from 'fs';

const htmlPath = join(
  __dirname,
  '../../../',
  process.env.NODE_ENV === 'test' ? '' : '../',
  '/html/student-pdf.html',
);

@Injectable()
export class GeneratePdfService {
  constructor(private readonly prismaService: PrismaService) {}

  async run(creatorEmail: string, dto: GeneratePdfDto) {
    const { studentId } = dto;
    console.log(htmlPath);

    const [student, classes] = await Promise.all([
      this.getStudent(studentId),
      this.getClasses(studentId),
    ]);

    const adpter = new ClassAdpter();

    const classesFormatted = classes.map((classRecord) => {
      return adpter.adapt(classRecord);
    });

    writeFile(
      '../bla.pdf',
      `
    
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap"
          rel="stylesheet"
        />
    
        <style>
          body {
            font-family: 'Roboto', sans-serif;
            background-color: #f1f1f1;
            color: #212121;
            margin: 0;
            padding: 0;
            min-height: 100vh;
          }
    
          @page {
            size: A4;
            margin: 0;
          }
    
          header {
            background-color: #cacaca;
            padding: 20px;
            padding-bottom: 0.2rem;
            font-family: 'Montserrat', sans-serif;
          }
    
          .student-container {
            border-top: 0.2px solid #00000046;
            box-shadow: 0 0.8px 1px #888888;
    
            padding: 5px 10px 0;
            background-color: #d3d1d1;
    
            display: flex;
            align-items: end;
            font-size: 0.65rem;
          }
    
          .student-container p {
            font-size: 0.8rem;
            margin: 0;
          }
    
          .student-container p + p {
            margin-left: 5px;
            font-size: 0.65rem;
          }
    
          h1 {
            margin: 0;
          }
    
          section {
            padding: 10px;
          }
    
          section p {
            margin-bottom: 10px;
          }
    
          section hr {
            margin: 15px 0;
            border: none;
            border-top: 1px solid #ccc;
          }
        </style>
        <title>Dirija Mais - Aula de Direção</title>
      </head>
      <body>
        <header>
          <h2>Dirija Mais - Carga Horária</h2>
        </header>
        <div class="student-container">
          <p>
            <b>Júlio Nepomuceno Lima</b>
          </p>
          <p><i> Data de emissão: 22/10/2023 - 10:02</i></p>
        </div>
    
        <section>
          <p><strong>Instrutor:</strong> [Nome do Instrutor]</p>
          <p><strong>Categoria:</strong> [Categoria da Aula]</p>
          <p>
            <strong>Horário:</strong> [Horário de Início] - [Horário de Término]
          </p>
          <hr />
          <p><strong>Instrutor:</strong> [Nome do Instrutor]</p>
          <p><strong>Categoria:</strong> [Categoria da Aula]</p>
          <p>
            <strong>Horário:</strong> [Horário de Início] - [Horário de Término]
          </p>
        </section>
      </body>
    </html>
    
    `,
      () => {},
    );
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

  private generatePdf() {
    const readHtml = requireAsPlainTextConstructor(htmlPath);
    let file = { content: readHtml };
    let options = { format: 'A4' };

    return new Promise((resolve, reject) => {
      generatePdf(file, options, (err, buffer) => {
        if (err) {
          reject(err);
        }

        resolve(buffer);
      });
    });
  }
}
