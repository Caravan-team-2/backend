import { Injectable } from '@nestjs/common';
import { CreateUserInsurranceInput } from './dto/create-user_insurrance.input';
import { UpdateUserInsurranceInput } from './dto/update-user_insurrance.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInsurance } from './entities/user-insurance.entity';
import { Vehicle } from 'src/user/entities/vehicle.entity';

@Injectable()
export class UserInsurranceService {
  findInsurranceVehicule(id: string) {
    return this.vehicleRepo.findOneBy({ insurranceId: id });
  }
  constructor(
    @InjectRepository(UserInsurance)
    private readonly userInsurranceRepo: Repository<UserInsurance>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepo: Repository<Vehicle>,
  ) {}
  findUserInsurrance(userId: string) {
    return this.userInsurranceRepo.findBy({ userId });
  }
  create(createUserInsurranceInput: CreateUserInsurranceInput) {
    return 'This action adds a new userInsurrance';
  }

  findAll() {
    return this.userInsurranceRepo.find();
  }

  findOne(id: string) {
    return this.userInsurranceRepo.findOneBy({ id });
  }

  update(id: number, updateUserInsurranceInput: UpdateUserInsurranceInput) {
    return `This action updates a #${id} userInsurrance`;
  }

  remove(id: number) {
    return `This action removes a #${id} userInsurrance`;
  }
}
