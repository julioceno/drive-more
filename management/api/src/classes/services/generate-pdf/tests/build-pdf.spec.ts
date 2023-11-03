import { Request } from 'express';
import { BuildPdf } from '../build-pdf';
import { GeneratePdfDto } from '../dto/generate-pdf.dto';
import puppeteer from 'puppeteer';
import { parentPort } from 'node:worker_threads';

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
          studentName: 'john.doe',
          timeZone: 'America/Sao_Paulo',
          url: 'localhost://3032',
        });
      }),
    },
  };
});

jest.mock('puppeteer');

(puppeteer.launch as any).mockImplementation(() => ({
  newPage: jest.fn().mockImplementation(() => ({
    setContent: jest.fn().mockResolvedValue({}),
    emulateMediaType: jest.fn().mockResolvedValue({}),
    pdf: jest.fn().mockResolvedValue({}),
    close: jest.fn().mockResolvedValue({}),
  })),
  close: jest.fn().mockResolvedValue({}),
}));

describe('BuildPdf', () => {
  it('should call parentPort.on', async () => {
    jest.mock('node:worker_threads');

    const onMessageSpy = jest.fn().mockImplementation((event, callback) => {
      callback({
        classes: [
          {
            category: 'mock.acronym',
            endAt: '29/10/2023 - 23:34',
            instructorName: 'mock.instructorName',
            startAt: '29/10/2023 - 23:34',
          },
        ],
        studentName: 'john.doe',
        timeZone: 'America/Sao_Paulo',
        url: 'localhost://3032',
      });
    });

    parentPort.on = onMessageSpy;

    await new BuildPdf().run();

    expect(onMessageSpy).toHaveBeenCalled();
  });

  it('should call parentPort.postMessage and pass file url', async () => {
    jest.mock('node:worker_threads');

    const postMessageSpy = jest.fn();

    parentPort.postMessage = postMessageSpy;

    await new BuildPdf().run();

    expect(postMessageSpy).toHaveBeenCalledWith(
      expect.stringContaining('localhost://3032/john.doe_'),
    );
  });

  it('should call page.pdf with correctaly params', async () => {
    jest.mock('puppeteer');

    const pdfMock = jest.fn().mockResolvedValue({});

    (puppeteer.launch as any).mockImplementation(() => ({
      newPage: jest.fn().mockImplementation(() => ({
        setContent: jest.fn().mockResolvedValue({}),
        emulateMediaType: jest.fn().mockResolvedValue({}),
        pdf: pdfMock,
        close: jest.fn().mockResolvedValue({}),
      })),
      close: jest.fn().mockResolvedValue({}),
    }));

    await new BuildPdf().run();

    expect(pdfMock).toHaveBeenCalledWith({
      format: 'A4',
      path: expect.stringContaining('./src/public/john.doe_'),
      printBackground: true,
    });
  });

  it('should call page.setContent and page.emulateMediaType', async () => {
    jest.mock('puppeteer');

    const setContentMock = jest.fn().mockResolvedValue({});
    const emulateMediaTypeMock = jest.fn().mockResolvedValue({});

    (puppeteer.launch as any).mockImplementation(() => ({
      newPage: jest.fn().mockImplementation(() => ({
        setContent: setContentMock,
        emulateMediaType: emulateMediaTypeMock,
        pdf: jest.fn().mockResolvedValue({}),
        close: jest.fn().mockResolvedValue({}),
      })),
      close: jest.fn().mockResolvedValue({}),
    }));

    await new BuildPdf().run();

    expect(setContentMock).toHaveBeenCalled();
    expect(emulateMediaTypeMock).toHaveBeenCalledWith('screen');
  });

  it('should call pupetter.launch with correctaly params', async () => {
    jest.mock('puppeteer');

    const puppeteerLaunh = (puppeteer.launch as any).mockImplementation(() => ({
      newPage: jest.fn().mockImplementation(() => ({
        setContent: jest.fn().mockResolvedValue({}),
        emulateMediaType: jest.fn().mockResolvedValue({}),
        pdf: jest.fn().mockResolvedValue({}),
        close: jest.fn().mockResolvedValue({}),
      })),
      close: jest.fn().mockResolvedValue({}),
    }));

    await new BuildPdf().run();

    expect(puppeteerLaunh).toHaveBeenCalledWith({ headless: 'new' });
  });

  it('should call browser.newPage and browser.close', async () => {
    jest.mock('puppeteer');

    const newPageMock = jest.fn().mockImplementation(() => ({
      setContent: jest.fn().mockResolvedValue({}),
      emulateMediaType: jest.fn().mockResolvedValue({}),
      pdf: jest.fn().mockResolvedValue({}),
      close: jest.fn().mockResolvedValue({}),
    }));

    const closeMock = jest.fn().mockResolvedValue({});

    const pupetterLaunch = puppeteer.launch as any;

    pupetterLaunch.mockImplementation(() => ({
      newPage: newPageMock,
      close: closeMock,
    }));

    await new BuildPdf().run();

    expect(newPageMock).toHaveBeenCalled();
    expect(closeMock).toHaveBeenCalled();
  });
});
