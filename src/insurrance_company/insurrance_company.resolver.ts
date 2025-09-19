import {
  Args,
  ID,
  Mutation,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { InsurranceCompanyService } from './insurrance_company.service';
import { UseGuards } from '@nestjs/common';
import { AcessTokenGuard } from 'src/authentication/guards/access-token.guard';
import { assAdminGuard } from 'src/authentication/guards/ass-admin.guard';
import { USER } from 'src/authentication/decorators/user.decorator';
import { SuperAdminGuard } from 'src/authentication/guards/super-admin.guard';
import { InsuranceCompany } from './entities/insurance-company.entity';

@UseGuards(AcessTokenGuard, assAdminGuard)
@Resolver()
export class InsurranceCompanyResolver {
  constructor(
    private readonly insurranceCompanyService: InsurranceCompanyService,
  ) {}
  @Query(() => InsuranceCompany)
  findOne(@Args('companyId', { type: () => ID }) id: string) {
    return this.insurranceCompanyService.findOne(id);
  }
  @UseGuards(SuperAdminGuard)
  @Query(() => [InsuranceCompany])
  findAll() {
    return this.insurranceCompanyService.findAll();
  }
  @Mutation(() => InsuranceCompany)
  addInsurranceCompany(@Args('companyId') companyName: string) {
    return this.insurranceCompanyService.create(companyName);
  }
}
