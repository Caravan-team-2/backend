import { Module } from '@nestjs/common';
import { InsurranceCompanyService } from './insurrance_company.service';
import { InsurranceCompanyResolver } from './insurrance_company.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InsuranceCompany } from './entities/insurance-company.entity';
import { UserInsurance } from './entities/user-insurance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InsuranceCompany, UserInsurance])],
  providers: [InsurranceCompanyResolver, InsurranceCompanyService],
})
export class InsurranceCompanyModule {}
