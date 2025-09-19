import { Module } from '@nestjs/common';
import { InsurranceCompanyService } from './insurrance_company.service';
import { InsurranceCompanyResolver } from './insurrance_company.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInsurance } from 'src/user_insurrance/entities/user-insurance.entity';
import { InsuranceCompany } from './entities/insurance-company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InsuranceCompany, UserInsurance])],
  providers: [InsurranceCompanyResolver, InsurranceCompanyService],
})
export class InsurranceCompanyModule {}
