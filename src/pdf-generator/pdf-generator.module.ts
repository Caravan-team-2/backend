import { Module } from '@nestjs/common';
import { PdfGeneratorService } from './pdf-generator.service';
import { PdfGeneratorResolver } from './pdf-generator.resolver';

@Module({
  providers: [PdfGeneratorResolver, PdfGeneratorService],
})
export class PdfGeneratorModule {}
