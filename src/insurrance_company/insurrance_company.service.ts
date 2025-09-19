import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InsuranceCompany } from './entities/insurance-company.entity';

@Injectable()
export class InsurranceCompanyService {
  constructor(
    @InjectRepository(InsuranceCompany)
    private readonly insuranceCompanyRepo: Repository<InsuranceCompany>,
  ) {}
  findAll() {
    return this.insuranceCompanyRepo.find();
  }

  findOne(id: string) {
    return this.insuranceCompanyRepo.findOneBy({ id });
  }

  delete(id: string) {
    return this.insuranceCompanyRepo.delete({ id });
  }

}
