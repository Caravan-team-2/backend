import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { UserInsurance } from './user-insurance.entity';
import { ConstatVehicle } from '../../constats/entities/constat-vehicle.entity';

@ObjectType()
@Entity('insurance_companies')
export class InsuranceCompany {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ name: 'company_name' })
  @Field()
  companyName: string;

  @Column({ name: 'logo_id', nullable: true })
  @Field({ nullable: true })
  logoId: string;

  @Column({ name: 'integration_id', nullable: true })
  @Field({ nullable: true })
  integrationId: string;

  @OneToMany(() => ConstatVehicle, (constatVehicle) => constatVehicle.insurer)
  @Field(() => [ConstatVehicle], { nullable: 'itemsAndList' })
  constatVehicle: Relation<ConstatVehicle[]>; //3mX8G
  @OneToMany(() => User, (user) => user.insuranceCompany)
  @Field(() => [User], { nullable: 'itemsAndList' })
  users: Relation<User[]>; //5daMA
  @OneToMany(() => UserInsurance, (userInsurance) => userInsurance.company)
  @Field(() => [UserInsurance], { nullable: 'itemsAndList' })
  userInsurances: Relation<UserInsurance[]>;
}

