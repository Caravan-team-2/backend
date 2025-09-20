import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ConstatVehicle } from 'src/constats/entities/constat-vehicle.entity';
import { Integration } from 'src/integration/entities/integration.entity';
import { User } from 'src/user/entities/user.entity';
import { UserInsurance } from 'src/user_insurrance/entities/user-insurance.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Relation,
  OneToOne,
} from 'typeorm';

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

  @OneToOne(() => Integration, (integration) => integration.id)
  @Field(() => Integration, { nullable: true })
  integration: Relation<Integration>; //lX9m8
  @OneToMany(() => ConstatVehicle, (constatVehicle) => constatVehicle.insurer)
  @Field(() => [ConstatVehicle], { nullable: 'itemsAndList' })
  constatVehicle: Relation<ConstatVehicle[]>; //3mX8G
  //3mX8G
  @OneToMany(() => User, (user) => user.insuranceCompany)
  @Field(() => [User], { nullable: 'itemsAndList' })
  users: Relation<User[]>; //5daMA
  //5daMA
  @OneToMany(() => UserInsurance, (userInsurance) => userInsurance.company)
  @Field(() => [UserInsurance], { nullable: 'itemsAndList' })
  userInsurances: Relation<UserInsurance[]>;
}
