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
@Entity('observations')
export class Observation {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ name: 'constat_id' })
  @Field()
  constatId: string;

  @ManyToOne(() => Constat, (constat) => constat.observations)
  @JoinColumn({ name: 'constat_id' })
  @Field(() => Constat)
  constat: Relation<Constat>;

  @Column({ name: 'driver_id' })
  @Field()
  driverId: string;

  @ManyToOne(() => User, (user) => user.observations)
  @JoinColumn({ name: 'driver_id' })
  @Field(() => User)
  driver: Relation<User>;

  @Column('text')
  @Field()
  note: string;
}