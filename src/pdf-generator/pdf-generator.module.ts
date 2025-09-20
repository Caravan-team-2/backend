import { Module } from '@nestjs/common';
import { pdfgeneratorservice } from './pdf-generator.service';
import { PdfGeneratorResolver } from './pdf-generator.resolver';

@Module({
  providers: [PdfGeneratorResolver, pdfgeneratorservice],
})
export class PdfGeneratorModule {}
