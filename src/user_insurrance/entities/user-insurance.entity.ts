import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Vehicle } from 'src/user/entities/vehicle.entity';
import { InsuranceCompany } from 'src/insurrance_company/entities/insurance-company.entity';

@ObjectType()
@Entity('user_insurance')
export class UserInsurance {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ name: 'user_id' })
  @Field()
  userId: string;
  @Column({ name: 'car_id' })
  @Field()
  carId: string;
  @OneToOne(() => Vehicle, (vehicle) => vehicle.insurrance)
  @JoinColumn({ name: 'car_id' })
  @Field(() => Vehicle)
  vehicle: Relation<Vehicle>;
  @ManyToOne(() => User, (user) => user.insurances)
  @JoinColumn({ name: 'user_id' })
  @Field(() => User)
  user: Relation<User>;

  @Column({ name: 'insurance_number', unique: true })
  @Field()
  insuranceNumber: string;

  @Column({ name: 'company_id' })
  @Field()
  companyId: string;

  @ManyToOne(() => InsuranceCompany, (company) => company.userInsurances)
  @JoinColumn({ name: 'company_id' })
  @Field(() => InsuranceCompany)
  company: Relation<InsuranceCompany>;

  @Column({ name: 'valid_from' })
  @Field()
  validFrom: Date;

  @Column({ name: 'valid_to' })
  @Field()
  validTo: Date;
}
