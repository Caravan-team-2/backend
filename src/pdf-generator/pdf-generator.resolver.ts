import { Resolver } from '@nestjs/graphql';
import { pdfgeneratorservice} from './pdf-generator.service';

@Resolver()
export class PdfGeneratorResolver {
  constructor(private readonly pdfGeneratorService: pdfgeneratorservice) {}
}
