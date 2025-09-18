import { Resolver } from '@nestjs/graphql';
import { InsurranceCompanyService } from './insurrance_company.service';

@Resolver()
export class InsurranceCompanyResolver {
  constructor(private readonly insurranceCompanyService: InsurranceCompanyService) {}
}
