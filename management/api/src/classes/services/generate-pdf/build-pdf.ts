import { requireAsPlainTextConstructor } from '@/common';
import { formatInTimeZone } from 'date-fns-tz';
import Handlebars from 'handlebars';
import { join } from 'node:path';
import { parentPort } from 'node:worker_threads';
import puppeteer, { Browser } from 'puppeteer';

const htmlPath = join(
  __dirname,
  '../../../',
  process.env.NODE_ENV === 'test' ? '' : '../',
  '/template/student-pdf.hbs',
);

const html = requireAsPlainTextConstructor(htmlPath);

class BuildPdf {
  async run() {
    const { studentName, classes } = (await this.getParams()) as any; // create tip

    const template = Handlebars.compile(html);

    const currentDate = new Date();

    const dateOfIsue = formatInTimeZone(
      currentDate,
      'America/Sao_Paulo', // CHANGE
      'dd/MM/yyyy - HH:mm ',
    );
    const transformedHtml = template({
      studentName,
      dateOfIsue,
      classes,
    });

    const browser = await puppeteer.launch({ headless: 'new' });

    const page = await this.buildPage(browser, transformedHtml);

    const studentNameFormatted = studentName.replace(/ /g, '_');

    const documentName = `${studentNameFormatted}_${currentDate.getTime()}.pdf`;

    const path = `files/${documentName}`;

    await page.pdf({
      path,
      margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
      printBackground: true,
      format: 'A4',
    });

    await browser.close();

    const url = join(__dirname, '..', '..', '..', '..', '..', path);

    parentPort.postMessage(url);
  }

  private async buildPage(browser: Browser, transformedHtml: string) {
    const page = await browser.newPage();

    await Promise.all([
      page.setContent(transformedHtml, { waitUntil: 'domcontentloaded' }),
      page.emulateMediaType('screen'),
    ]);

    return page;
  }

  private getParams() {
    return new Promise((resolve) => {
      parentPort.on('message', resolve);
    });
  }
}

new BuildPdf().run();
