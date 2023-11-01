import { Request } from 'express';
import { BuildPdf } from '../build-pdf';
import { GeneratePdfDto } from '../dto/generate-pdf.dto';

jest.mock('node:worker_threads', () => {
  return {
    parentPort: {
      postMessage: jest.fn(),
      on: jest.fn().mockImplementation((event, callback) => {
        callback({
          classes: [
            {
              category: 'mock.acronym',
              endAt: '29/10/2023 - 23:34',
              instructorName: 'mock.instructorName',
              startAt: '29/10/2023 - 23:34',
            },
          ],
          studentName: 'aaa',
          timeZone: 'America/Sao_Paulo',
          url: 'localhost://3032',
        });
      }),
    },
  };
});

jest.mock('puppeteer');

const puppeteer = require('puppeteer');

puppeteer.launch.mockImplementation(() => ({
  newPage: jest.fn().mockImplementation(() => ({
    setContent: jest.fn().mockResolvedValue({}),
    emulateMediaType: jest.fn().mockResolvedValue({}),
    pdf: jest.fn().mockResolvedValue({}),
    close: jest.fn().mockResolvedValue({}),
  })),
  close: jest.fn().mockResolvedValue({}),
}));

describe('BuildPdf', () => {
  it('', async () => {
    jest.mock('puppeteer');

    const puppeteer = require('puppeteer');
    const pdfMock = jest.fn().mockResolvedValue({});

    puppeteer.launch.mockImplementation(() => ({
      newPage: jest.fn().mockImplementation(() => ({
        setContent: jest.fn().mockResolvedValue({}),
        emulateMediaType: jest.fn().mockResolvedValue({}),
        pdf: pdfMock,
        close: jest.fn().mockResolvedValue({}),
      })),
      close: jest.fn().mockResolvedValue({}),
    }));

    await new BuildPdf().run();

    // Verifica se a função 'pdf' foi chamada
    expect(pdfMock).toHaveBeenCalledWith({
      format: 'A4',
      path: expect.stringContaining('./src/public/'),
      printBackground: true,
    });
  });
});
