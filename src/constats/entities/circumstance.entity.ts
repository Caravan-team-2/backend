import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Constat } from './constat.entity';
import { User } from '../../user/entities/user.entity';

@ObjectType()
@Entity('circumstances')
export class Circumstance {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ name: 'constat_id' })
  @Field()
  constatId: string;

  @ManyToOne(() => Constat, (constat) => constat.circumstances)
  @JoinColumn({ name: 'constat_id' })
  @Field(() => Constat)
  constat: Relation<Constat>;

  @Column({ name: 'driver_id' })
  @Field()
  driverId: string;

  @ManyToOne(() => User, (user) => user.circumstances)
  @JoinColumn({ name: 'driver_id' })
  @Field(() => User)
  driver: Relation<User>;

  @Column()
  @Field()
  code: number; //seed later or something
}
