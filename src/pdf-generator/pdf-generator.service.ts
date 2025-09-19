import * as fs from 'fs';
import * as hbs from 'hbs';
import path from 'path';
import puppeteer from 'puppeteer';
import { CreateConstatDto } from './dto/create-constat.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class pdfgeneratorservice {
  private compiletemplate(data: CreateConstatDto): string {
    const templateName = 'constats';
    const filepath = path.join(
      __dirname,
      './src/email/templates',
      'templates',
      `${templateName}.hbs`,
    );
    /*eslint-disable*/
    const template = fs.readFileSync(filepath, 'utf-8');
    const compiled = hbs.handlebars.compile(template);
    return compiled(data);
  }
  async generateconstatpdf(data: CreateConstatDto) {
    const browser = await puppeteer.launch({ headless: 'shell' });
    const page = await browser.newPage();

    const content = this.compiletemplate(data);

    await page.setContent(content, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'a4' });

    await browser.close();
    return pdfBuffer;
  }
}
