import { Resolver } from '@nestjs/graphql';
import { PdfGeneratorService } from './pdf-generator.service';

@Resolver()
export class PdfGeneratorResolver {
  constructor(private readonly pdfGeneratorService: PdfGeneratorService) {}
}
