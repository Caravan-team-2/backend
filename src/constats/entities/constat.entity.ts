import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { ConstatVehicle } from './constat-vehicle.entity';
import { Circumstance } from './circumstance.entity';
import { Damage } from './damage.entity';
import { Observation } from './observation.entity';
import { Signature } from '../../signature/entities/signature.entity';

export enum ConstatStatus {
  SUBMITTED = 'SUBMITTED',
  VALIDATED = 'VALIDATED',
  REJECTED = 'REJECTED',
}

registerEnumType(ConstatStatus, {
  name: 'ConstatStatus',
  description: 'Status of the constat process',
});

@ObjectType()
@Entity('constats')
export class Constat {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ name: 'driver_a_id' })
  @Field()
  driverAId: string;

  @ManyToOne(() => User, (user) => user.constatsAsDriverA)
  @JoinColumn({ name: 'driver_a_id' })
  @Field(() => User)
  driverA: Relation<User>;

  @Column({ name: 'driver_b_id' })
  @Field()
  driverBId: string;

  @ManyToOne(() => User, (user) => user.constatsAsDriverB)
  @JoinColumn({ name: 'driver_b_id' })
  @Field(() => User)
  driverB: Relation<User>;

  @Column({ name: 'date_time' })
  @Field()
  dateTime: Date;

  @Column()
  @Field()
  location: string;

  @Column({ name: 'injured_count', default: 0 })
  @Field()
  injuredCount: number;

  @CreateDateColumn({ name: 'created_at' })
  @Field()
  createdAt: Date;

  @OneToMany(() => ConstatVehicle, (constatVehicle) => constatVehicle.constat, {
    cascade: true,
  })
  @Field(() => [ConstatVehicle], { nullable: 'itemsAndList' })
  constatVehicles: Relation<ConstatVehicle[]>;

  @OneToMany(() => Circumstance, (circumstance) => circumstance.constat, {
    cascade: true,
  })
  @Field(() => [Circumstance], { nullable: 'itemsAndList' })
  circumstances: Relation<Circumstance[]>;

  @OneToMany(() => Damage, (damage) => damage.constat, { cascade: true })
  @Field(() => [Damage], { nullable: 'itemsAndList' })
  damages: Relation<Damage[]>;

  @OneToMany(() => Observation, (observation) => observation.constat, {
    cascade: true,
  })
  @Field(() => [Observation], { nullable: 'itemsAndList' })
  observations: Relation<Observation[]>;

  @OneToMany(() => Signature, (signature) => signature.constat, {
    cascade: true,
  })
  // the estimated cost of the damages in dzd
  // string format to avoid floating point issues
  // nullable because the cost might not be estimated yet
  // and will be filled later by an expert
  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  cost: string;
  @Field(() => [Signature], { nullable: 'itemsAndList' })
  signatures: Relation<Signature[]>;

  @Column({
    type: 'enum',
    enum: ConstatStatus,
    default: ConstatStatus.SUBMITTED,
  })
  @Field(() => ConstatStatus)
  status: ConstatStatus;
}
