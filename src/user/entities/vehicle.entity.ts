import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { ConstatVehicle } from '../../constats/entities/constat-vehicle.entity';
import { UserInsurance } from 'src/user_insurrance/entities/user-insurance.entity';

@ObjectType()
@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ name: 'insurrance_id' })
  @Field()
  insurranceId: string;

  @OneToOne(() => UserInsurance, (insurrance) => insurrance.vehicle)
  @JoinColumn({ name: 'insurrance_id' })
  @Field(() => UserInsurance)
  insurrance: Relation<UserInsurance>;

  @Column({ name: 'registration_number', unique: true })
  @Field()
  registrationNumber: string;

  @Column()
  @Field()
  make: string;

  @Column()
  @Field()
  model: string;

  @Column()
  @Field()
  type: string;

  @OneToMany(() => ConstatVehicle, (constatVehicle) => constatVehicle.vehicle)
  @Field(() => [ConstatVehicle], { nullable: 'itemsAndList' })
  constatVehicles: Relation<ConstatVehicle[]>;
}
