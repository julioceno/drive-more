import { requireAsPlainTextConstructor } from '@/common';
import { formatInTimeZone } from 'date-fns-tz';
import Handlebars from 'handlebars';
import { join } from 'node:path';
import { parentPort } from 'node:worker_threads';
import puppeteer from 'puppeteer';
import { IBuildData } from './types';
console.log({ puppeteer });

const htmlPath = join(
  __dirname,
  '../../../',
  process.env.NODE_ENV === 'test' ? '' : '../',
  '/template/student-pdf.hbs',
);

const html = requireAsPlainTextConstructor(htmlPath);

export class BuildPdf {
  PATTERN_DATE_OF_ISUE = 'dd/MM/yyyy - HH:mm ';
  CURRENT_DATE = new Date();

  async run() {
    const data = await this.getParams();
    const { url, studentName } = data;

    const transformedHtml = this.buildTransformedHtml(data);

    const documentName = this.buildDocumentName(studentName);

    await this.buildPdf(transformedHtml, documentName);

    const urlFile = `${url}/${documentName}`;

    parentPort.postMessage(urlFile);
  }

  private async buildPdf(transformedHtml: string, documentName: string) {
    const browser = await puppeteer.launch({ headless: 'new' });

    const page = await browser.newPage();

    await Promise.all([
      page.setContent(transformedHtml, { waitUntil: 'domcontentloaded' }),
      page.emulateMediaType('screen'),
    ]);

    const path = `./src/public/${documentName}`;

    await page.pdf({
      path,
      printBackground: true,
      format: 'A4',
    });

    await browser.close();

    return page;
  }

  private buildTransformedHtml(data: IBuildData) {
    const { timeZone, studentName, classes } = data;

    const template = Handlebars.compile(html);

    const dateOfIsue = formatInTimeZone(
      this.CURRENT_DATE,
      timeZone,
      this.PATTERN_DATE_OF_ISUE,
    );
    const transformedHtml = template({
      studentName,
      dateOfIsue,
      classes,
    });

    return transformedHtml;
  }

  private getParams(): Promise<IBuildData> {
    return new Promise((resolve) => {
      parentPort.on('message', resolve);
    });
  }

  private buildDocumentName(studentName: string) {
    const studentNameFormatted = studentName.replace(/ /g, '_');

    const documentName = `${studentNameFormatted}_${this.CURRENT_DATE.getTime()}.pdf`;
    return documentName;
  }
}

new BuildPdf().run();
